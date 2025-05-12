import type { Semester } from "./semester"

export interface Period {
  id: string
  name: string
  startTime: string
  endTime: string
  dayOfWeek: string
  semesterId: string
  createdAt: string
  updatedAt: string
  semester?: Semester
}

export interface CreatePeriodDto {
  name: string
  startTime: string
  endTime: string
  dayOfWeek: string
  semesterId: string
}

export interface UpdatePeriodDto {
  name?: string
  startTime?: string
  endTime?: string
  dayOfWeek?: string
  semesterId?: string
}

export const DAYS_OF_WEEK = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
]
