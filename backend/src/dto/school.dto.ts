import { IsString, IsOptional, MinLength, MaxLength } from "class-validator"
import { Expose } from "class-transformer"

export class CreateSchoolDto {
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
  @IsOptional()
  @MaxLength(20)
  @Expose()
  code?: string
}

export class UpdateSchoolDto {
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
}
