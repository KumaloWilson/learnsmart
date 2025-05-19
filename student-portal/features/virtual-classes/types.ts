export interface VirtualClass {
  id: string
  title: string
  description: string
  scheduledStartTime: string
  scheduledEndTime: string
  meetingId: string
  meetingLink: string
  meetingConfig: {
    passcode: string
    platform: string
  }
  status: string
  actualStartTime: string | null
  actualEndTime: string | null
  duration: number | null
  isRecorded: boolean
  recordingUrl: string | null
  lecturerProfileId: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
  course?: {
    id: string
    name: string
    description: string
    code: string
    level: number
    creditHours: number
    programId: string
    createdAt: string
    updatedAt: string
  }
  semester?: {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
    academicYear: number
    createdAt: string
    updatedAt: string
  }
  lecturerProfile: {
    id: string
    staffId: string
    title: string
    specialization: string
    bio: string
    officeLocation: string
    officeHours: string
    phoneNumber: string
    status: string
    joinDate: string
    endDate: string | null
    userId: string
    departmentId: string
    createdAt: string
    updatedAt: string
    user: {
      firstName: string
      lastName: string
    }
  }
  attended?: boolean
}

export interface JoinVirtualClassRequest {
  virtualClassId: string
  studentProfileId: string
}

export interface JoinVirtualClassResponse {
  success: boolean
  message: string
  meetingLink?: string
}

export enum VirtualClassStatus {
  UPCOMING = "upcoming", // More than 5 minutes before start time
  JOINABLE = "joinable", // Within 5 minutes of start time
  ONGOING = "ongoing", // Between start and end time
  PAST = "past", // After end time
}
