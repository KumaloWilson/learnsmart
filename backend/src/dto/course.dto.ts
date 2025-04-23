import { IsString, IsOptional, MinLength, MaxLength, IsUUID, IsInt, Min, Max } from "class-validator"
import { Expose } from "class-transformer"

export class CreateCourseDto {
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
  level: number

  @IsInt()
  @Min(1)
  @Max(12)
  @Expose()
  creditHours: number

  @IsUUID(4)
  @Expose()
  programId: string
}

export class UpdateCourseDto {
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
  level?: number

  @IsInt()
  @Min(1)
  @Max(12)
  @IsOptional()
  @Expose()
  creditHours?: number

  @IsUUID(4)
  @IsOptional()
  @Expose()
  programId?: string
}
