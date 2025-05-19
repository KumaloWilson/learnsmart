import { IsString, IsOptional, MinLength, MaxLength, IsUUID } from "class-validator"
import { Expose } from "class-transformer"

export class CreateDepartmentDto {
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

  @IsUUID(4)
  @Expose()
  schoolId: string
}

export class UpdateDepartmentDto {
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

  @IsUUID(4)
  @IsOptional()
  @Expose()
  schoolId?: string
}
