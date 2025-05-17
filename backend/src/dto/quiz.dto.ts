import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  IsNumber,
} from "class-validator"
import { Expose, Type } from "class-transformer"

// Quiz DTOs
export class CreateQuizDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsUUID()
  @Expose()
  courseId!: string

  @IsUUID()
  @Expose()
  semesterId!: string

  @IsUUID()
  @Expose()
  lecturerProfileId!: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose()
  dueDate?: Date

  @IsOptional()
  @IsNumber()
  @Expose()
  timeLimit?: number

  @IsOptional()
  @IsNumber()
  @Expose()
  totalMarks?: number

  @IsOptional()
  @IsNumber()
  @Expose()
  passingScore?: number

  @IsOptional()
  @IsBoolean()
  @Expose()
  allowMultipleAttempts?: boolean

  @IsOptional()
  @IsBoolean()
  @Expose()
  randomizeQuestions?: boolean

  @IsOptional()
  @IsBoolean()
  @Expose()
  showAnswers?: boolean

  @IsOptional()
  @IsUUID()
  @Expose()
  courseTopicId?: string
}

export class UpdateQuizDto {
  @IsOptional()
  @IsString()
  @Expose()
  title?: string

  @IsOptional()
  @IsString()
  @Expose()
  description?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Expose()
  dueDate?: Date

  @IsOptional()
  @IsNumber()
  @Expose()
  timeLimit?: number

  @IsOptional()
  @IsNumber()
  @Expose()
  totalMarks?: number

  @IsOptional()
  @IsNumber()
  @Expose()
  passingScore?: number

  @IsOptional()
  @IsBoolean()
  @Expose()
  allowMultipleAttempts?: boolean

  @IsOptional()
  @IsBoolean()
  @Expose()
  randomizeQuestions?: boolean

  @IsOptional()
  @IsBoolean()
  @Expose()
  showAnswers?: boolean

  @IsOptional()
  @IsBoolean()
  @Expose()
  isPublished?: boolean

  @IsOptional()
  @IsUUID()
  @Expose()
  courseTopicId?: string
}

export class QuizFilterDto {
  @IsOptional()
  @IsUUID()
  @Expose()
  courseId?: string

  @IsOptional()
  @IsUUID()
  @Expose()
  semesterId?: string

  @IsOptional()
  @IsUUID()
  @Expose()
  lecturerProfileId?: string

  @IsOptional()
  @IsBoolean()
  @Expose()
  isPublished?: boolean

  @IsOptional()
  @IsString()
  @Expose()
  search?: string
}

// Quiz Question DTOs
export class CreateQuizQuestionDto {
  @IsUUID()
  @Expose()
  quizId!: string

  @IsString()
  @Expose()
  questionText!: string

  @IsEnum(["multiple_choice", "true_false", "short_answer"])
  @Expose()
  questionType!: string

  @IsOptional()
  @IsNumber()
  @Expose()
  points?: number

  @IsOptional()
  @IsString()
  @Expose()
  explanation?: string

  @IsOptional()
  @IsBoolean()
  @Expose()
  isRequired?: boolean
}

export class UpdateQuizQuestionDto {
  @IsOptional()
  @IsString()
  @Expose()
  questionText?: string

  @IsOptional()
  @IsEnum(["multiple_choice", "true_false", "short_answer"])
  @Expose()
  questionType?: string

  @IsOptional()
  @IsNumber()
  @Expose()
  points?: number

  @IsOptional()
  @IsString()
  @Expose()
  explanation?: string

  @IsOptional()
  @IsBoolean()
  @Expose()
  isRequired?: boolean
}

// Quiz Option DTOs
export class CreateQuizOptionDto {
  @IsUUID()
  @Expose()
  questionId!: string

  @IsString()
  @Expose()
  optionText!: string

  @IsBoolean()
  @Expose()
  isCorrect!: boolean

  @IsOptional()
  @IsString()
  @Expose()
  explanation?: string
}

export class UpdateQuizOptionDto {
  @IsOptional()
  @IsString()
  @Expose()
  optionText?: string

  @IsOptional()
  @IsBoolean()
  @Expose()
  isCorrect?: boolean

  @IsOptional()
  @IsString()
  @Expose()
  explanation?: string
}

// Quiz Reordering DTOs
export class ReorderQuizQuestionsDto {
  @IsUUID()
  @Expose()
  quizId!: string

  @IsArray()
  @IsUUID(4, { each: true })
  @Expose()
  questionIds!: string[]
}

export class ReorderQuizOptionsDto {
  @IsUUID()
  @Expose()
  questionId!: string

  @IsArray()
  @IsUUID(4, { each: true })
  @Expose()
  optionIds!: string[]
}

export class StartQuizAttemptDto {
  @IsUUID(4)
  @Expose()
  quizId: string

  @IsUUID(4)
  @Expose()
  studentProfileId: string
}

export class SubmitQuizAttemptDto {
  @IsArray()
  @Expose()
  answers: object[]
}

export class GradeQuizAttemptDto {
  @IsInt()
  @Min(0)
  @Expose()
  score: number

  @IsBoolean()
  @Expose()
  isPassed: boolean

  @IsString()
  @IsOptional()
  @Expose()
  feedback?: string

  @IsObject()
  @IsOptional()
  @Expose()
  aiAnalysis?: object
}

export class QuizAttemptFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  quizId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  studentProfileId?: string

  @IsString()
  @IsOptional()
  @Expose()
  status?: string

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  startDate?: Date

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @Expose()
  endDate?: Date
}

export class GenerateQuizQuestionsDto {
  @IsString()
  @Expose()
  topic: string

  @IsInt()
  @Min(1)
  @Expose()
  numberOfQuestions: number

  @IsEnum(["multiple_choice", "true_false", "short_answer", "mixed"], {
    message: "Question type must be one of: multiple_choice, true_false, short_answer, mixed",
  })
  @Expose()
  questionType: "multiple_choice" | "true_false" | "short_answer" | "mixed"

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsString()
  @IsOptional()
  @Expose()
  additionalContext?: string
}
