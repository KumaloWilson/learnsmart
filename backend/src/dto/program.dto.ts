import { IsString, IsOptional, MinLength, MaxLength, IsUUID, IsEnum, IsInt, Min, Max } from "class-validator"
import { Expose } from "class-transformer"

export class CreateProgramDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Expose()
  name: string

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @Expose()
  description?: string

  @IsString()
  @MaxLength(20)
  @Expose()
  code: string

  @IsInt()
  @Min(1)
  @Max(10)
  @Expose()
  durationYears: number

  @IsEnum(["undergraduate", "postgraduate", "doctorate"], {
    message: "Level must be one of: undergraduate, postgraduate, doctorate",
  })
  @Expose()
  level: "undergraduate" | "postgraduate" | "doctorate"

  @IsUUID(4)
  @Expose()
  departmentId: string
}

export class UpdateProgramDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  @Expose()
  name?: string

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @Expose()
  description?: string

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Expose()
  code?: string

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  @Expose()
  durationYears?: number

  @IsEnum(["undergraduate", "postgraduate", "doctorate"], {
    message: "Level must be one of: undergraduate, postgraduate, doctorate",
  })
  @IsOptional()
  @Expose()
  level?: "undergraduate" | "postgraduate" | "doctorate"

  @IsUUID(4)
  @IsOptional()
  @Expose()
  departmentId?: string
}
