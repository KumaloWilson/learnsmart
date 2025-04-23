import { IsString, IsOptional, IsBoolean, IsDate, IsInt, Min, Max } from "class-validator"
import { Expose, Type } from "class-transformer"

export class CreateSemesterDto {
  @IsString()
  @Expose()
  name: string

  @IsDate()
  @Type(() => Date)
  @Expose()
  startDate: Date

  @IsDate()
  @Type(() => Date)
  @Expose()
  endDate: Date

  @IsBoolean()
  @Expose()
  isActive: boolean

  @IsInt()
  @Min(2000)
  @Max(2100)
  @Expose()
  academicYear: number
}

export class UpdateSemesterDto {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string

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

  @IsBoolean()
  @IsOptional()
  @Expose()
  isActive?: boolean

  @IsInt()
  @Min(2000)
  @Max(2100)
  @IsOptional()
  @Expose()
  academicYear?: number
}
