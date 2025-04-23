import type { Request, Response, NextFunction } from "express"
import Joi from "joi"
import { validate as classValidatorValidate, type ValidationError } from "class-validator"
import { plainToInstance } from "class-transformer"
import "reflect-metadata"

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((detail) => detail.message),
      })
    }

    next()
  }
}

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Convert plain object to class instance
    const dtoObject = plainToInstance(dtoClass, req.body)

    // Validate
    const errors = await classValidatorValidate(dtoObject as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    })

    if (errors.length > 0) {
      const validationErrors = errors.map((error: ValidationError) => {
        const constraints = error.constraints ? Object.values(error.constraints) : ["Invalid value"]
        return {
          property: error.property,
          errors: constraints,
        }
      })

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: validationErrors,
      })
    }

    // Add validated object to request
    req.body = dtoObject
    next()
  }
}

// Helper function for query parameters
export function validateQuery(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.query)

    const errors = await classValidatorValidate(dtoObject as object, {
      whitelist: true,
      skipMissingProperties: true,
    })

    if (errors.length > 0) {
      const validationErrors = errors.map((error: ValidationError) => {
        const constraints = error.constraints ? Object.values(error.constraints) : ["Invalid value"]
        return {
          property: error.property,
          errors: constraints,
        }
      })

      return res.status(400).json({
        status: "error",
        message: "Query validation failed",
        errors: validationErrors,
      })
    }

    req.query = dtoObject as any
    next()
  }
}

// Helper function for params
export function validateParams(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.params)

    const errors = await classValidatorValidate(dtoObject as object, {
      whitelist: true,
      skipMissingProperties: false,
    })

    if (errors.length > 0) {
      const validationErrors = errors.map((error: ValidationError) => {
        const constraints = error.constraints ? Object.values(error.constraints) : ["Invalid value"]
        return {
          property: error.property,
          errors: constraints,
        }
      })

      return res.status(400).json({
        status: "error",
        message: "Path parameter validation failed",
        errors: validationErrors,
      })
    }

    req.params = dtoObject as any
    next()
  }
}

// Auth validation schemas
export const authValidation = {
  register: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "lecturer", "student").required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
  }),
}

// Student validation schemas
export const studentValidation = {
  createStudent: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    studentId: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().optional(),
    address: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    programId: Joi.string().uuid().required(),
    enrollmentDate: Joi.date().required(),
    currentLevel: Joi.number().integer().min(1).optional(),
  }),

  updateStudent: Joi.object({
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().optional(),
    address: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    status: Joi.string().valid("active", "suspended", "graduated", "withdrawn").optional(),
    currentLevel: Joi.number().integer().min(1).optional(),
    programId: Joi.string().uuid().optional(),
    graduationDate: Joi.date().optional(),
  }),

  enrollInCourse: Joi.object({
    studentProfileId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().required(),
  }),

  updateEnrollment: Joi.object({
    status: Joi.string().valid("enrolled", "completed", "failed", "withdrawn").optional(),
    grade: Joi.number().min(0).max(100).optional(),
  }),

  createAcademicRecord: Joi.object({
    studentProfileId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().required(),
    gpa: Joi.number().min(0).max(4).required(),
    cgpa: Joi.number().min(0).max(4).required(),
    totalCredits: Joi.number().integer().min(0).required(),
    earnedCredits: Joi.number().integer().min(0).required(),
    remarks: Joi.string().optional(),
  }),

  updateAcademicRecord: Joi.object({
    gpa: Joi.number().min(0).max(4).optional(),
    cgpa: Joi.number().min(0).max(4).optional(),
    totalCredits: Joi.number().integer().min(0).optional(),
    earnedCredits: Joi.number().integer().min(0).optional(),
    remarks: Joi.string().optional(),
  }),

  batchEnroll: Joi.object({
    courseId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().required(),
    studentIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  }),
}

// Lecturer validation schemas
export const lecturerValidation = {
  createLecturer: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    staffId: Joi.string().optional(),
    title: Joi.string().optional(),
    specialization: Joi.string().optional(),
    bio: Joi.string().optional(),
    officeLocation: Joi.string().optional(),
    officeHours: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    departmentId: Joi.string().uuid().required(),
    joinDate: Joi.date().required(),
  }),

  updateLecturer: Joi.object({
    title: Joi.string().optional(),
    specialization: Joi.string().optional(),
    bio: Joi.string().optional(),
    officeLocation: Joi.string().optional(),
    officeHours: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    status: Joi.string().valid("active", "on_leave", "retired", "terminated").optional(),
    departmentId: Joi.string().uuid().optional(),
    endDate: Joi.date().optional(),
  }),

  assignCourse: Joi.object({
    lecturerProfileId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().required(),
    role: Joi.string().valid("primary", "assistant", "guest").optional(),
  }),

  updateCourseAssignment: Joi.object({
    role: Joi.string().valid("primary", "assistant", "guest").optional(),
    isActive: Joi.boolean().optional(),
  }),

  createTeachingMaterial: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    type: Joi.string().valid("lecture_note", "assignment", "resource", "syllabus", "other").required(),
    fileUrl: Joi.string().required(),
    fileName: Joi.string().required(),
    fileType: Joi.string().required(),
    fileSize: Joi.number().integer().optional(),
    isPublished: Joi.boolean().optional(),
    publishDate: Joi.date().optional(),
    lecturerProfileId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().required(),
  }),

  updateTeachingMaterial: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    type: Joi.string().valid("lecture_note", "assignment", "resource", "syllabus", "other").optional(),
    fileUrl: Joi.string().optional(),
    fileName: Joi.string().optional(),
    fileType: Joi.string().optional(),
    fileSize: Joi.number().integer().optional(),
    isPublished: Joi.boolean().optional(),
    publishDate: Joi.date().optional(),
  }),

  createAssessment: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    type: Joi.string().valid("quiz", "assignment", "exam", "project", "other").required(),
    totalMarks: Joi.number().required(),
    weightage: Joi.number().required(),
    dueDate: Joi.date().required(),
    isPublished: Joi.boolean().optional(),
    publishDate: Joi.date().optional(),
    lecturerProfileId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().required(),
  }),

  updateAssessment: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    type: Joi.string().valid("quiz", "assignment", "exam", "project", "other").optional(),
    totalMarks: Joi.number().optional(),
    weightage: Joi.number().optional(),
    dueDate: Joi.date().optional(),
    isPublished: Joi.boolean().optional(),
    publishDate: Joi.date().optional(),
  }),

  gradeSubmission: Joi.object({
    marks: Joi.number().required(),
    feedback: Joi.string().optional(),
  }),

  batchAssignCourses: Joi.object({
    lecturerProfileId: Joi.string().uuid().required(),
    courseIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
    semesterId: Joi.string().uuid().required(),
    role: Joi.string().valid("primary", "assistant", "guest").optional(),
  }),
}

// Notification validation schemas
export const notificationValidation = {
  createNotification: Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string()
      .valid("info", "success", "warning", "error", "assignment", "grade", "announcement", "enrollment", "system")
      .required(),
    userId: Joi.string().uuid().required(),
    link: Joi.string().uri().optional(),
    metadata: Joi.object().optional(),
    senderId: Joi.string().uuid().optional(),
  }),

  bulkCreateNotifications: Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string()
      .valid("info", "success", "warning", "error", "assignment", "grade", "announcement", "enrollment", "system")
      .required(),
    userIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
    link: Joi.string().uri().optional(),
    metadata: Joi.object().optional(),
    senderId: Joi.string().uuid().optional(),
  }),

  updateNotification: Joi.object({
    isRead: Joi.boolean().optional(),
    readAt: Joi.date().optional(),
    isActive: Joi.boolean().optional(),
  }),

  notifyNewAssignment: Joi.object({
    assignmentId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
    studentIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
  }),

  notifyGradePosted: Joi.object({
    studentId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
    assessmentId: Joi.string().uuid().required(),
  }),

  notifyNewAnnouncement: Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
    userIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
    senderId: Joi.string().uuid().optional(),
  }),

  notifyCourseEnrollment: Joi.object({
    studentId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
  }),

  notifyCourseAssignment: Joi.object({
    lecturerId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
  }),
}

export const studentPortalValidation = {
  submitAssessment: Joi.object({
    assessmentId: Joi.string().uuid().required(),
    studentProfileId: Joi.string().uuid().required(),
    submissionText: Joi.string().allow("", null),
  }),

  joinVirtualClass: Joi.object({
    virtualClassId: Joi.string().uuid().required(),
    studentProfileId: Joi.string().uuid().required(),
  }),

  attemptQuiz: Joi.object({
    quizId: Joi.string().uuid().required(),
    studentProfileId: Joi.string().uuid().required(),
    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string().uuid().required(),
          selectedOptionId: Joi.string().uuid().required(),
        }),
      )
      .required(),
  }),
}

// AI Recommendation validation schemas
export const aiRecommendationValidation = {
  createLearningResource: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    type: Joi.string().valid("video", "article", "book", "exercise", "quiz", "other").required(),
    url: Joi.string().required(),
    content: Joi.string().optional(),
    metadata: Joi.object().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    difficulty: Joi.number().min(0).max(5).optional(),
    durationMinutes: Joi.number().min(0).optional(),
    courseId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().optional(),
  }),

  updateLearningResource: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    type: Joi.string().valid("video", "article", "book", "exercise", "quiz", "other").optional(),
    url: Joi.string().optional(),
    content: Joi.string().optional(),
    metadata: Joi.object().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    difficulty: Joi.number().min(0).max(5).optional(),
    durationMinutes: Joi.number().min(0).optional(),
    courseId: Joi.string().uuid().optional(),
    semesterId: Joi.string().uuid().optional(),
  }),

  createLearningRecommendation: Joi.object({
    studentProfileId: Joi.string().uuid().required(),
    learningResourceId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
    reason: Joi.string().optional(),
    relevanceScore: Joi.number().min(0).max(1).required(),
  }),

  updateLearningRecommendation: Joi.object({
    isViewed: Joi.boolean().optional(),
    viewedAt: Joi.date().optional(),
    isSaved: Joi.boolean().optional(),
    isCompleted: Joi.boolean().optional(),
    completedAt: Joi.date().optional(),
    rating: Joi.number().min(1).max(5).optional(),
    feedback: Joi.string().optional(),
  }),

  recordInteraction: Joi.object({
    studentProfileId: Joi.string().uuid().required(),
    learningResourceId: Joi.string().uuid().required(),
    interactionType: Joi.string().valid("view", "save", "complete", "rate", "share").required(),
    durationSeconds: Joi.number().min(0).optional(),
    rating: Joi.number().min(1).max(5).optional(),
    feedback: Joi.string().optional(),
    metadata: Joi.object().optional(),
  }),

  generateRecommendations: Joi.object({
    studentProfileId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
    count: Joi.number().min(1).max(10).optional(),
    includeCompleted: Joi.boolean().optional(),
  }),

  provideFeedback: Joi.object({
    recommendationId: Joi.string().uuid().required(),
    isHelpful: Joi.boolean().required(),
    feedback: Joi.string().optional(),
  }),

  markRecommendation: Joi.object({
    action: Joi.string().valid("view", "save", "complete").required(),
  }),
}

// Course Topic validations
export const courseTopicValidation = {
  createCourseTopic: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(null, ""),
    orderIndex: Joi.number().integer().min(1),
    durationHours: Joi.number().integer().min(1),
    learningObjectives: Joi.array().items(Joi.string()),
    keywords: Joi.array().items(Joi.string()),
    difficulty: Joi.string().valid("beginner", "intermediate", "advanced"),
    isActive: Joi.boolean(),
    courseId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().required(),
  }),
  updateCourseTopic: Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(null, ""),
    orderIndex: Joi.number().integer().min(1),
    durationHours: Joi.number().integer().min(1),
    learningObjectives: Joi.array().items(Joi.string()),
    keywords: Joi.array().items(Joi.string()),
    difficulty: Joi.string().valid("beginner", "intermediate", "advanced"),
    isActive: Joi.boolean(),
  }),
  reorderTopics: Joi.object({
    topicIds: Joi.array().items(Joi.string().uuid()).required(),
  }),
}

// Topic Progress validations
export const topicProgressValidation = {
  markTopicCompleted: Joi.object({
    studentProfileId: Joi.string().uuid().required(),
    courseTopicId: Joi.string().uuid().required(),
    timeSpentMinutes: Joi.number().integer().min(0),
    assessmentResults: Joi.object(),
  }),
  updateTopicProgress: Joi.object({
    isCompleted: Joi.boolean(),
    completedAt: Joi.date(),
    masteryLevel: Joi.number().min(0).max(100),
    timeSpentMinutes: Joi.number().integer().min(0),
    assessmentResults: Joi.object(),
  }),
}

// Course Mastery validations
export const courseMasteryValidation = {
  updateCourseMastery: Joi.object({
    masteryLevel: Joi.number().min(0).max(100),
    quizAverage: Joi.number().min(0).max(100),
    assignmentAverage: Joi.number().min(0).max(100),
    topicCompletionPercentage: Joi.number().min(0).max(100),
    totalTopicsCompleted: Joi.number().integer().min(0),
    totalTopics: Joi.number().integer().min(0),
  }),
}

// At-Risk Student validations
export const atRiskStudentValidation = {
  createAtRiskStudent: Joi.object({
    studentProfileId: Joi.string().uuid().required(),
    courseId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().required(),
    riskScore: Joi.number().min(0).max(100).required(),
    riskLevel: Joi.string().valid("low", "medium", "high", "critical").required(),
    riskFactors: Joi.array().items(Joi.string()).required(),
    recommendedActions: Joi.string().allow(null, ""),
    aiAnalysis: Joi.object(),
  }),
  updateAtRiskStudent: Joi.object({
    riskScore: Joi.number().min(0).max(100),
    riskLevel: Joi.string().valid("low", "medium", "high", "critical"),
    riskFactors: Joi.array().items(Joi.string()),
    recommendedActions: Joi.string().allow(null, ""),
    aiAnalysis: Joi.object(),
    isResolved: Joi.boolean(),
    resolvedAt: Joi.date(),
    resolutionNotes: Joi.string().allow(null, ""),
  }),
  resolveAtRiskStudent: Joi.object({
    id: Joi.string().uuid().required(),
    resolutionNotes: Joi.string().allow(null, ""),
  }),
  identifyAtRiskStudents: Joi.object({
    courseId: Joi.string().uuid().required(),
    semesterId: Joi.string().uuid().required(),
    lecturerProfileId: Joi.string().uuid(),
  }),
}
