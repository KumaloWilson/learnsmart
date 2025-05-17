import type { Request, Response } from "express"
import { QuizService } from "../services/quiz.service"
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

export class QuizController {
  private quizService: QuizService

  constructor() {
    this.quizService = new QuizService()
  }

  async findAll(req: Request, res: Response) {
    try {
      const filters: QuizFilterDto = req.query as any
      const quizzes = await this.quizService.findAll(filters)
      return res.status(200).json(quizzes)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const quiz = await this.quizService.findById(id)
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" })
      }
      return res.status(200).json(quiz)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data: CreateQuizDto = req.body
      const quiz = await this.quizService.create(data)
      return res.status(201).json(quiz)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data: UpdateQuizDto = req.body
      const quiz = await this.quizService.update(id, data)
      return res.status(200).json(quiz)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await this.quizService.delete(id)
      return res.status(200).json(result)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Quiz attempt methods
  async getQuizAttemptsByQuizID(req: Request, res: Response) {
    try {
      const { quizId } = req.params
      const attempts = await this.quizService.getQuizAttemptsByQuizId(quizId)
      return res.status(200).json(attempts)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getQuizAttempts(req: Request, res: Response) {
    try {
      const filters: QuizAttemptFilterDto = req.query as any
      const attempts = await this.quizService.getQuizAttempts(filters)
      return res.status(200).json(attempts)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getQuizAttemptById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const attempt = await this.quizService.getQuizAttemptById(id)
      if (!attempt) {
        return res.status(404).json({ message: "Quiz attempt not found" })
      }
      return res.status(200).json(attempt)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async startQuizAttempt(req: Request, res: Response) {
    try {
      const data: StartQuizAttemptDto = req.body
      const attempt = await this.quizService.startQuizAttempt(data)
      return res.status(201).json(attempt)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async submitQuizAttempt(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data: SubmitQuizAttemptDto = req.body
      const attempt = await this.quizService.submitQuizAttempt(id, data)
      return res.status(200).json(attempt)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async manualGradeQuizAttempt(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data: GradeQuizAttemptDto = req.body
      const attempt = await this.quizService.manualGradeQuizAttempt(id, data)
      return res.status(200).json(attempt)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // AI integration methods
  async generateQuizQuestions(req: Request, res: Response) {
    try {
      const data: GenerateQuizQuestionsDto = req.body
      const questions = await this.quizService.generateQuizQuestions(data)
      return res.status(200).json(questions)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  // Analytics methods
  async getQuizStatistics(req: Request, res: Response) {
    try {
      const { quizId } = req.params
      const statistics = await this.quizService.getQuizStatistics(quizId)
      return res.status(200).json(statistics)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getStudentQuizPerformance(req: Request, res: Response) {
    try {
      const { studentProfileId, courseId, semesterId } = req.params
      const performance = await this.quizService.getStudentQuizPerformance(studentProfileId, courseId, semesterId)
      return res.status(200).json(performance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }

  async getClassQuizPerformance(req: Request, res: Response) {
    try {
      const { courseId, semesterId } = req.params
      const performance = await this.quizService.getClassQuizPerformance(courseId, semesterId)
      return res.status(200).json(performance)
    } catch (error: any) {
      return res.status(500).json({ message: error.message })
    }
  }
}
