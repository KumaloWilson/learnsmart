import { IsString, IsOptional, IsEnum, IsUUID } from "class-validator"
import { Expose } from "class-transformer"

export class CreatePeriodDto {
  @IsString()
  @Expose()
  name: string

  @IsString()
  @Expose()
  startTime: string

  @IsString()
  @Expose()
  endTime: string

  @IsEnum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], {
    message: "Day of week must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday",
  })
  @Expose()
  dayOfWeek: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

  @IsUUID(4)
  @Expose()
  semesterId: string
}

export class UpdatePeriodDto {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string

  @IsString()
  @IsOptional()
  @Expose()
  startTime?: string

  @IsString()
  @IsOptional()
  @Expose()
  endTime?: string

  @IsEnum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], {
    message: "Day of week must be one of: monday, tuesday, wednesday, thursday, friday, saturday, sunday",
  })
  @IsOptional()
  @Expose()
  dayOfWeek?: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

  @IsUUID(4)
  @IsOptional()
  @Expose()
  semesterId?: string
}
