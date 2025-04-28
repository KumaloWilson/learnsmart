import { Op } from "sequelize"
import axios from "axios"
import { NotificationService } from "./notification.service"
import type {
  CreateQuizDto,
  UpdateQuizDto,
  StartQuizAttemptDto,
  SubmitQuizAttemptDto,
  GradeQuizAttemptDto,
  QuizFilterDto,
  QuizAttemptFilterDto,
  GenerateQuizQuestionsDto,
} from "../dto/quiz.dto"
import { Course } from "../models/Course"
import { LecturerProfile } from "../models/LecturerProfile"
import { Quiz } from "../models/Quiz"
import { QuizAttempt } from "../models/QuizAttempt"
import { Semester } from "../models/Semester"
import { StudentProfile } from "../models/StudentProfile"
import { User } from "../models/User"

export class QuizService {
  private notificationService: NotificationService
  private openaiApiKey: string

  constructor() {
    this.notificationService = new NotificationService()
    this.openaiApiKey = process.env.OPENAI_API_KEY || ""
  }

  async findAll(filters?: QuizFilterDto) {
    const whereClause: any = {}

    if (filters) {
      if (filters.lecturerProfileId) {
        whereClause.lecturerProfileId = filters.lecturerProfileId
      }
      if (filters.courseId) {
        whereClause.courseId = filters.courseId
      }
      if (filters.semesterId) {
        whereClause.semesterId = filters.semesterId
      }
      if (filters.isActive !== undefined) {
        whereClause.isActive = filters.isActive
      }
      if (filters.startDate && filters.endDate) {
        whereClause.startDate = {
          [Op.between]: [filters.startDate, filters.endDate],
        }
      } else if (filters.startDate) {
        whereClause.startDate = {
          [Op.gte]: filters.startDate,
        }
      } else if (filters.endDate) {
        whereClause.endDate = {
          [Op.lte]: filters.endDate,
        }
      }
    }

    return Quiz.findAll({
      where: whereClause,
      include: [
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
      order: [["createdAt", "DESC"]],
    })
  }

  async findById(id: string) {
    return Quiz.findByPk(id, {
      include: [
        {
          model: LecturerProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
        {
          model: Course,
        },
        {
          model: Semester,
        },
      ],
    })
  }

  async create(data: CreateQuizDto) {
    // Create the quiz
    const quiz = await Quiz.create(data as any)

    // Notify enrolled students
    try {
      await this.notifyStudents(quiz.id)
    } catch (error) {
      console.error("Error notifying students:", error)
    }

    return this.findById(quiz.id)
  }

  async update(id: string, data: UpdateQuizDto) {
    const quiz = await Quiz.findByPk(id)
    if (!quiz) {
      throw new Error("Quiz not found")
    }

    await quiz.update(data)
    return this.findById(id)
  }

  async delete(id: string) {
    const quiz = await Quiz.findByPk(id)
    if (!quiz) {
      throw new Error("Quiz not found")
    }

    // Soft delete by setting isActive to false
    await quiz.update({ isActive: false })
    return { message: "Quiz deactivated successfully" }
  }

  // Quiz attempt methods
  async getQuizAttempts(filters?: QuizAttemptFilterDto) {
    const whereClause: any = {}

    if (filters) {
      if (filters.quizId) {
        whereClause.quizId = filters.quizId
      }
      if (filters.studentProfileId) {
        whereClause.studentProfileId = filters.studentProfileId
      }
      if (filters.status) {
        whereClause.status = filters.status
      }
      if (filters.startDate && filters.endDate) {
        whereClause.startTime = {
          [Op.between]: [filters.startDate, filters.endDate],
        }
      } else if (filters.startDate) {
        whereClause.startTime = {
          [Op.gte]: filters.startDate,
        }
      } else if (filters.endDate) {
        whereClause.startTime = {
          [Op.lte]: filters.endDate,
        }
      }
    }

    return QuizAttempt.findAll({
      where: whereClause,
      include: [
        {
          model: Quiz,
          include: [
            {
              model: Course,
            },
          ],
        },
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
      order: [["startTime", "DESC"]],
    })
  }

  async getQuizAttemptById(id: string) {
    return QuizAttempt.findByPk(id, {
      include: [
        {
          model: Quiz,
          include: [
            {
              model: Course,
            },
          ],
        },
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
    })
  }

  async startQuizAttempt(data: StartQuizAttemptDto) {
    // Check if quiz exists and is active
    const quiz = await Quiz.findByPk(data.quizId)
    if (!quiz) {
      throw new Error("Quiz not found")
    }

    if (!quiz.isActive) {
      throw new Error("Quiz is not active")
    }

    const now = new Date()
    if (now < quiz.startDate) {
      throw new Error("Quiz has not started yet")
    }

    if (now > quiz.endDate) {
      throw new Error("Quiz has already ended")
    }

    // Check if student has already attempted this quiz
    const existingAttempt = await QuizAttempt.findOne({
      where: {
        quizId: data.quizId,
        studentProfileId: data.studentProfileId,
        status: {
          [Op.in]: ["in_progress", "completed", "submitted"],
        },
      },
    })

    if (existingAttempt) {
      throw new Error("You have already attempted this quiz")
    }

    // Generate questions for this attempt
    const questions = await this.generateQuizQuestions({
      topic: quiz.topic,
      numberOfQuestions: quiz.numberOfQuestions,
      questionType: quiz.questionType,
      courseId: quiz.courseId,
      additionalContext: quiz.aiPrompt ? JSON.stringify(quiz.aiPrompt) : undefined,
    })

    // Create the attempt
    const attempt = await QuizAttempt.create({
      quizId: data.quizId,
      studentProfileId: data.studentProfileId,
      startTime: now,
      questions,
      status: "in_progress",
    })

    return this.getQuizAttemptById(attempt.id)
  }

  async submitQuizAttempt(id: string, data: SubmitQuizAttemptDto) {
    const attempt = await QuizAttempt.findByPk(id, {
      include: [Quiz],
    })

    if (!attempt) {
      throw new Error("Quiz attempt not found")
    }

    if (attempt.status !== "in_progress") {
      throw new Error("This quiz attempt is not in progress")
    }

    // Check if time limit has been exceeded
    const now = new Date()
    const startTime = new Date(attempt.startTime)
    const timeElapsedMinutes = (now.getTime() - startTime.getTime()) / (1000 * 60)

    const status = timeElapsedMinutes > attempt.quiz!.timeLimit ? "timed_out" : "submitted"

    // Grade the attempt
    const { score, isPassed, feedback, aiAnalysis } = await this.gradeQuizAttempt(attempt, data.answers)

    // Update the attempt
    await attempt.update({
      answers: data.answers,
      endTime: now,
      status,
      score,
      isPassed,
      feedback,
      aiAnalysis,
    })

    // Notify student about the result
    try {
      await this.notifyQuizResult(attempt.id)
    } catch (error) {
      console.error("Error notifying student about quiz result:", error)
    }

    return this.getQuizAttemptById(id)
  }

  async manualGradeQuizAttempt(id: string, data: GradeQuizAttemptDto) {
    const attempt = await QuizAttempt.findByPk(id)
    if (!attempt) {
      throw new Error("Quiz attempt not found")
    }

    await attempt.update({
      score: data.score,
      isPassed: data.isPassed,
      feedback: data.feedback,
      aiAnalysis: data.aiAnalysis,
      status: "completed",
    })

    // Notify student about the result
    try {
      await this.notifyQuizResult(attempt.id)
    } catch (error) {
      console.error("Error notifying student about quiz result:", error)
    }

    return this.getQuizAttemptById(id)
  }

  // AI integration methods
  async generateQuizQuestions(data: GenerateQuizQuestionsDto): Promise<any[]> {
    try {
      if (!this.openaiApiKey) {
        // Return mock questions if no API key is available
        return this.generateMockQuestions(data)
      }

      // Get course details for context
      const course = await Course.findByPk(data.courseId)
      if (!course) {
        throw new Error("Course not found")
      }

      // Prepare the prompt for OpenAI
      const prompt = this.prepareQuestionGenerationPrompt(data, course.name)

      // Call OpenAI API
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an educational AI assistant that generates quiz questions for university courses. Generate questions in JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            "Content-Type": "application/json",
          },
        },
      )

      // Parse the response
      const content = response.data.choices[0].message.content
      let questions = []

      try {
        // Extract JSON from the response
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\[([\s\S]*?)\]/)
        const jsonString = jsonMatch ? jsonMatch[1] : content
        questions = JSON.parse(jsonString.includes("[") ? jsonString : `[${jsonString}]`)
      } catch (error) {
        console.error("Error parsing OpenAI response:", error)
        questions = this.generateMockQuestions(data)
      }

      return questions
    } catch (error) {
      console.error("Error generating quiz questions with OpenAI:", error)
      return this.generateMockQuestions(data)
    }
  }

  private prepareQuestionGenerationPrompt(data: GenerateQuizQuestionsDto, courseName: string): string {
    const questionTypeInstructions = {
      multiple_choice:
        "Generate multiple-choice questions with 4 options each. Each question should have only one correct answer.",
      true_false: "Generate true/false questions. Each question should be a statement that is either true or false.",
      short_answer: "Generate short answer questions. Each question should require a brief response (1-3 sentences).",
      mixed:
        "Generate a mix of multiple-choice, true/false, and short answer questions. For multiple-choice, provide 4 options with one correct answer.",
    }

    return `
      Generate ${data.numberOfQuestions} quiz questions about ${data.topic} for a ${courseName} course.
      
      ${questionTypeInstructions[data.questionType]}
      
      Additional context: ${data.additionalContext || "None"}
      
      Format the questions as a JSON array with the following structure:
      
      For multiple-choice questions:
      {
        "type": "multiple_choice",
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option text",
        "explanation": "Explanation of why this is the correct answer"
      }
      
      For true/false questions:
      {
        "type": "true_false",
        "question": "The statement to evaluate",
        "correctAnswer": true or false,
        "explanation": "Explanation of why this is true or false"
      }
      
      For short answer questions:
      {
        "type": "short_answer",
        "question": "The question text",
        "sampleAnswer": "A sample correct answer",
        "keywords": ["keyword1", "keyword2", "keyword3"],
        "explanation": "What a good answer should include"
      }
      
      Return ONLY the JSON array without any additional text.
    `
  }

  private generateMockQuestions(data: GenerateQuizQuestionsDto): any[] {
    const questions = []
    const types =
      data.questionType === "mixed" ? ["multiple_choice", "true_false", "short_answer"] : [data.questionType]

    for (let i = 0; i < data.numberOfQuestions; i++) {
      const type = types[i % types.length]

      if (type === "multiple_choice") {
        questions.push({
          type: "multiple_choice",
          question: `Sample multiple choice question ${i + 1} about ${data.topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A",
          explanation: "This is the explanation for the correct answer.",
        })
      } else if (type === "true_false") {
        questions.push({
          type: "true_false",
          question: `Sample true/false statement ${i + 1} about ${data.topic}.`,
          correctAnswer: i % 2 === 0,
          explanation: "This is the explanation for why this is true or false.",
        })
      } else {
        questions.push({
          type: "short_answer",
          question: `Sample short answer question ${i + 1} about ${data.topic}?`,
          sampleAnswer: "This is a sample correct answer for the question.",
          keywords: ["keyword1", "keyword2", "keyword3"],
          explanation: "A good answer should include these key concepts.",
        })
      }
    }

    return questions
  }

  private async gradeQuizAttempt(
    attempt: QuizAttempt,
    answers: any[],
  ): Promise<{ score: number; isPassed: boolean; feedback?: string; aiAnalysis?: object }> {
    const quiz = attempt.quiz!
    const questions = attempt.questions as any[]

    if (!questions || !answers || questions.length !== answers.length) {
      throw new Error("Invalid answers format")
    }

    let correctCount = 0
    const questionResults = []

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      const answer = answers[i]
      let isCorrect = false
      let explanation = ""

      if (question.type === "multiple_choice") {
        isCorrect = answer.selectedOption === question.correctAnswer
        explanation = isCorrect
          ? "Correct! " + question.explanation
          : `Incorrect. The correct answer is: ${question.correctAnswer}. ${question.explanation}`
      } else if (question.type === "true_false") {
        isCorrect = answer.answer === question.correctAnswer
        explanation = isCorrect
          ? "Correct! " + question.explanation
          : `Incorrect. The correct answer is: ${question.correctAnswer}. ${question.explanation}`
      } else if (question.type === "short_answer") {
        // For short answers, check if the answer contains the keywords
        const answerText = answer.answer.toLowerCase()
        const keywordMatches = question.keywords.filter((keyword: string) => answerText.includes(keyword.toLowerCase()))
        const keywordPercentage = keywordMatches.length / question.keywords.length
        isCorrect = keywordPercentage >= 0.6 // Consider correct if 60% of keywords are present
        explanation = isCorrect
          ? "Good answer! " + question.explanation
          : `Your answer could be improved. A good answer should include: ${question.sampleAnswer}. ${question.explanation}`
      }

      if (isCorrect) {
        correctCount++
      }

      questionResults.push({
        question: question.question,
        userAnswer: answer,
        isCorrect,
        explanation,
      })
    }

    const score = (correctCount / questions.length) * quiz.totalMarks
    const isPassed = score >= quiz.passingMarks

    // Generate feedback
    const feedback = this.generateFeedback(score, quiz.totalMarks, isPassed, questionResults)

    // Generate AI analysis
    const aiAnalysis = {
      score,
      totalMarks: quiz.totalMarks,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      percentageCorrect: (correctCount / questions.length) * 100,
      isPassed,
      questionResults,
      strengths: this.identifyStrengths(questionResults),
      weaknesses: this.identifyWeaknesses(questionResults),
      recommendations: this.generateRecommendations(questionResults, quiz.topic),
    }

    return { score, isPassed, feedback, aiAnalysis }
  }

  private generateFeedback(score: number, totalMarks: number, isPassed: boolean, questionResults: any[]): string {
    const percentage = (score / totalMarks) * 100
    let feedback = ""

    if (isPassed) {
      if (percentage >= 90) {
        feedback = "Excellent work! You have demonstrated a strong understanding of the material."
      } else if (percentage >= 80) {
        feedback = "Great job! You have a good grasp of the concepts."
      } else if (percentage >= 70) {
        feedback = "Good work! You understand most of the material, but there's room for improvement."
      } else {
        feedback = "You've passed, but consider reviewing the material to strengthen your understanding."
      }
    } else {
      feedback = "You didn't pass this time. Review the material and try again. Focus on the questions you got wrong."
    }

    // Add specific feedback on incorrect answers
    const incorrectQuestions = questionResults.filter((result) => !result.isCorrect)
    if (incorrectQuestions.length > 0) {
      feedback += "\n\nAreas to focus on:\n"
      incorrectQuestions.forEach((result, index) => {
        feedback += `${index + 1}. ${result.question}\n`
      })
    }

    return feedback
  }

  private identifyStrengths(questionResults: any[]): string[] {
    const correctQuestions = questionResults.filter((result) => result.isCorrect)
    const strengths = []

    if (correctQuestions.length > questionResults.length * 0.7) {
      strengths.push("Overall strong understanding of the topic")
    }

    // Group correct answers by question type
    const typeGroups: Record<string, any[]> = {}
    correctQuestions.forEach((result) => {
      const type = result.question.type || "unknown"
      if (!typeGroups[type]) {
        typeGroups[type] = []
      }
      typeGroups[type].push(result)
    })

    // Identify strengths based on question types
    Object.entries(typeGroups).forEach(([type, questions]) => {
      if (questions.length > 0) {
        strengths.push(`Strong performance on ${type} questions`)
      }
    })

    return strengths.length > 0 ? strengths : ["No specific strengths identified"]
  }

  private identifyWeaknesses(questionResults: any[]): string[] {
    const incorrectQuestions = questionResults.filter((result) => !result.isCorrect)
    const weaknesses = []

    if (incorrectQuestions.length > questionResults.length * 0.5) {
      weaknesses.push("General difficulty with the topic")
    }

    // Group incorrect answers by question type
    const typeGroups: Record<string, any[]> = {}
    incorrectQuestions.forEach((result) => {
      const type = result.question.type || "unknown"
      if (!typeGroups[type]) {
        typeGroups[type] = []
      }
      typeGroups[type].push(result)
    })

    // Identify weaknesses based on question types
    Object.entries(typeGroups).forEach(([type, questions]) => {
      if (questions.length > 0) {
        weaknesses.push(`Difficulty with ${type} questions`)
      }
    })

    return weaknesses.length > 0 ? weaknesses : ["No specific weaknesses identified"]
  }

  private generateRecommendations(questionResults: any[], topic: string): string[] {
    const incorrectQuestions = questionResults.filter((result) => !result.isCorrect)
    const recommendations = []

    if (incorrectQuestions.length > 0) {
      recommendations.push(
        `Review the material on ${topic}, especially the concepts covered in the incorrect questions`,
      )
    }

    if (incorrectQuestions.length > questionResults.length * 0.7) {
      recommendations.push("Consider seeking additional help or resources on this topic")
    }

    // Add specific recommendations based on question types
    const typeGroups: Record<string, any[]> = {}
    incorrectQuestions.forEach((result) => {
      const type = result.question.type || "unknown"
      if (!typeGroups[type]) {
        typeGroups[type] = []
      }
      typeGroups[type].push(result)
    })

    // Add recommendations based on question types
    Object.entries(typeGroups).forEach(([type, questions]) => {
      if (questions.length > 0) {
        recommendations.push(`Practice more ${type} questions to improve your understanding`)
      }
    })

    return recommendations.length > 0 ? recommendations : ["Continue studying the material to reinforce your knowledge"]
  }

  // Notification methods
  private async notifyStudents(quizId: string) {
    const quiz = await this.findById(quizId)
    if (!quiz || !quiz.course) {
      throw new Error("Quiz or course not found")
    }

    // Get all students enrolled in the course
    const { CourseEnrollment, StudentProfile } = require("../models")
    const enrollments = await CourseEnrollment.findAll({
      where: {
        courseId: quiz.courseId,
        semesterId: quiz.semesterId,
        status: "enrolled",
      },
      include: [
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["id"],
            },
          ],
        },
      ],
    })

    // Send notification to each student
    const userIds = enrollments.map((enrollment: any) => enrollment.studentProfile?.user?.id).filter((id: string) => id)

    if (userIds.length > 0) {
      await this.notificationService.notifyNewAnnouncement({
        courseId: quiz.courseId,
        semesterId: quiz.semesterId,
        title: "New Quiz Available",
        message: `A new quiz "${quiz.title}" for ${quiz.course.name} is now available. It will be open until ${new Date(
          quiz.endDate,
        ).toLocaleString()}.`
      })
    }
  }

  private async notifyQuizResult(attemptId: string) {
    const attempt = await this.getQuizAttemptById(attemptId)
    if (!attempt || !attempt.quiz || !attempt.studentProfile?.user) {
      throw new Error("Quiz attempt, quiz, or student not found")
    }

    const userId = attempt.studentProfile.user.id
    const isPassed = attempt.isPassed
    const score = attempt.score
    const totalMarks = attempt.quiz.totalMarks

    await this.notificationService.createNotification({
      title: `Quiz Result: ${attempt.quiz.title}`,
      message: `You ${isPassed ? "passed" : "did not pass"} the quiz with a score of ${score}/${totalMarks}.`,
      type: "grade",
      userId,
      link: `/student/quizzes/${attemptId}/result`,
      metadata: {
        quizId: attempt.quizId,
        attemptId,
        score,
        totalMarks,
        isPassed,
      },
    })
  }

  // Analytics methods
  async getQuizStatistics(quizId: string) {
    const attempts = await QuizAttempt.findAll({
      where: {
        quizId,
        status: {
          [Op.in]: ["completed", "submitted"],
        },
      },
    })

    const totalAttempts = attempts.length
    const passedAttempts = attempts.filter((a) => a.isPassed).length
    const failedAttempts = totalAttempts - passedAttempts
    const passRate = totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0
    const averageScore = totalAttempts > 0 ? attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts : 0

    return {
      totalAttempts,
      passedAttempts,
      failedAttempts,
      passRate,
      averageScore,
    }
  }

  async getStudentQuizPerformance(studentProfileId: string, courseId: string, semesterId: string) {
    const attempts = await QuizAttempt.findAll({
      include: [
        {
          model: Quiz,
          where: {
            courseId,
            semesterId,
          },
        },
      ],
      where: {
        studentProfileId,
        status: {
          [Op.in]: ["completed", "submitted"],
        },
      },
    })

    const totalAttempts = attempts.length
    const passedAttempts = attempts.filter((a) => a.isPassed).length
    const averageScore = totalAttempts > 0 ? attempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts : 0

    return {
      totalAttempts,
      passedAttempts,
      passRate: totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0,
      averageScore,
      quizzes: attempts.map((a) => ({
        quizId: a.quizId,
        quizTitle: a.quiz?.title,
        score: a.score,
        totalMarks: a.quiz?.totalMarks,
        isPassed: a.isPassed,
        attemptDate: a.startTime,
      })),
    }
  }

  async getClassQuizPerformance(courseId: string, semesterId: string) {
    const attempts = await QuizAttempt.findAll({
      include: [
        {
          model: Quiz,
          where: {
            courseId,
            semesterId,
          },
        },
        {
          model: StudentProfile,
          include: [
            {
              model: User,
              attributes: ["firstName", "lastName", "email"],
            },
          ],
        },
      ],
      where: {
        status: {
          [Op.in]: ["completed", "submitted"],
        },
      },
    })

    // Group attempts by quiz
    const quizGroups: Record<string, any[]> = {}
    attempts.forEach((attempt) => {
      if (!quizGroups[attempt.quizId]) {
        quizGroups[attempt.quizId] = []
      }
      quizGroups[attempt.quizId].push(attempt)
    })

    // Calculate statistics for each quiz
    const quizStats = Object.entries(quizGroups).map(([quizId, quizAttempts]) => {
      const quiz = quizAttempts[0].quiz
      const totalAttempts = quizAttempts.length
      const passedAttempts = quizAttempts.filter((a) => a.isPassed).length
      const averageScore =
        totalAttempts > 0 ? quizAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts : 0

      return {
        quizId,
        quizTitle: quiz?.title,
        totalAttempts,
        passedAttempts,
        passRate: totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0,
        averageScore,
      }
    })

    // Group attempts by student
    const studentGroups: Record<string, any[]> = {}
    attempts.forEach((attempt) => {
      if (!studentGroups[attempt.studentProfileId]) {
        studentGroups[attempt.studentProfileId] = []
      }
      studentGroups[attempt.studentProfileId].push(attempt)
    })

    // Calculate statistics for each student
    const studentStats = Object.entries(studentGroups).map(([studentProfileId, studentAttempts]) => {
      const student = studentAttempts[0].studentProfile
      const totalAttempts = studentAttempts.length
      const passedAttempts = studentAttempts.filter((a) => a.isPassed).length
      const averageScore =
        totalAttempts > 0 ? studentAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / totalAttempts : 0

      return {
        studentProfileId,
        studentName: student ? `${student.user?.firstName} ${student.user?.lastName}` : "Unknown",
        totalAttempts,
        passedAttempts,
        passRate: totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0,
        averageScore,
      }
    })

    return {
      quizStats,
      studentStats,
      overallStats: {
        totalAttempts: attempts.length,
        passedAttempts: attempts.filter((a) => a.isPassed).length,
        passRate: attempts.length > 0 ? (attempts.filter((a) => a.isPassed).length / attempts.length) * 100 : 0,
        averageScore: attempts.length > 0 ? attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length : 0,
      },
    }
  }
}
