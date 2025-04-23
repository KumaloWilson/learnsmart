import { IsArray, IsBoolean, IsDate, IsEnum, IsInt, IsObject, IsOptional, IsString, IsUUID, Min } from "class-validator"
import { Expose, Type } from "class-transformer"

export class CreateQuizDto {
  @IsString()
  @Expose()
  title: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsString()
  @Expose()
  topic: string

  @IsInt()
  @Min(1)
  @Expose()
  numberOfQuestions: number

  @IsInt()
  @Min(1)
  @Expose()
  timeLimit: number

  @IsDate()
  @Type(() => Date)
  @Expose()
  startDate: Date

  @IsDate()
  @Type(() => Date)
  @Expose()
  endDate: Date

  @IsInt()
  @IsOptional()
  @Expose()
  totalMarks?: number

  @IsInt()
  @IsOptional()
  @Expose()
  passingMarks?: number

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean

  @IsBoolean()
  @IsOptional()
  @Expose()
  isRandomized?: boolean

  @IsObject()
  @IsOptional()
  @Expose()
  aiPrompt?: object

  @IsEnum(["multiple_choice", "true_false", "short_answer", "mixed"], {
    message: "Question type must be one of: multiple_choice, true_false, short_answer, mixed",
  })
  @Expose()
  questionType: "multiple_choice" | "true_false" | "short_answer" | "mixed"

  @IsString()
  @IsOptional()
  @Expose()
  instructions?: string

  @IsUUID(4)
  @Expose()
  lecturerProfileId: string

  @IsUUID(4)
  @Expose()
  courseId: string

  @IsUUID(4)
  @Expose()
  semesterId: string
}

export class UpdateQuizDto {
  @IsString()
  @IsOptional()
  @Expose()
  title?: string

  @IsString()
  @IsOptional()
  @Expose()
  description?: string

  @IsString()
  @IsOptional()
  @Expose()
  topic?: string

  @IsInt()
  @Min(1)
  @IsOptional()
  @Expose()
  numberOfQuestions?: number

  @IsInt()
  @Min(1)
  @IsOptional()
  @Expose()
  timeLimit?: number

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

  @IsInt()
  @IsOptional()
  @Expose()
  totalMarks?: number

  @IsInt()
  @IsOptional()
  @Expose()
  passingMarks?: number

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean

  @IsBoolean()
  @IsOptional()
  @Expose()
  isRandomized?: boolean

  @IsObject()
  @IsOptional()
  @Expose()
  aiPrompt?: object

  @IsEnum(["multiple_choice", "true_false", "short_answer", "mixed"], {
    message: "Question type must be one of: multiple_choice, true_false, short_answer, mixed",
  })
  @IsOptional()
  @Expose()
  questionType?: "multiple_choice" | "true_false" | "short_answer" | "mixed"

  @IsString()
  @IsOptional()
  @Expose()
  instructions?: string
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

export class QuizFilterDto {
  @IsUUID(4)
  @IsOptional()
  @Expose()
  lecturerProfileId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  courseId?: string

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean

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
