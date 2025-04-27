import { Sequelize } from "sequelize-typescript"
import { School } from "./School"
import { Department } from "./Department"
import { Program } from "./Program"
import { Course } from "./Course"
import { Semester } from "./Semester"
import { CourseSemester } from "./CourseSemester"
import { Period } from "./Period"
import { User } from "./User"
import { RefreshToken } from "./RefreshToken"
import { PasswordResetToken } from "./PasswordResetToken"
import { StudentProfile } from "./StudentProfile"
import { CourseEnrollment } from "./CourseEnrollment"
import { AcademicRecord } from "./AcademicRecord"
import { LecturerProfile } from "./LecturerProfile"
import { CourseAssignment } from "./CourseAssignment"
import { TeachingMaterial } from "./TeachingMaterial"
import { Assessment } from "./Assessment"
import { AssessmentSubmission } from "./AssessmentSubmission"
import { Notification } from "./Notification"
import { VirtualClass } from "./VirtualClass"
import { VirtualClassAttendance } from "./VirtualClassAttendance"
import { Quiz } from "./Quiz"
import { QuizQuestion } from "./QuizQuestion"
import { QuizOption } from "./QuizOption"
import { QuizAttempt } from "./QuizAttempt"
import { QuizResponse } from "./QuizResponse"
import { PhysicalAttendance } from "./PhysicalAttendance"
import { LearningResource } from "./LearningResource"
import { LearningRecommendation } from "./LearningRecommendation"
import { ResourceInteraction } from "./ResourceInteraction"
import {StudentPerformance} from "./StudentPerformance"


// console.log("Initializing Sequelize with the following configuration:")
// console.log("DB_HOST:", process.env.DB_HOST || "localhost")
// console.log("DB_PORT:", process.env.DB_PORT || "5432")
// console.log("DB_USERNAME:", process.env.DB_USERNAME || "postgres")
// console.log("DB_NAME:", process.env.DB_NAME || "learn_smart")
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "******" : "not set")
// console.log("DB_SSL:", process.env.DB_SSL ? "true" : "false")

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "learn_smart",
  logging: false,
  models: [
    School,
    Department,
    Program,
    Course,
    Semester,
    CourseSemester,
    Period,
    User,
    RefreshToken,
    PasswordResetToken,
    StudentProfile,
    CourseEnrollment,
    AcademicRecord,
    LecturerProfile,
    CourseAssignment,
    TeachingMaterial,
    Assessment,
    AssessmentSubmission,
    Notification,
    VirtualClass,
    VirtualClassAttendance,
    Quiz,
    QuizQuestion,
    QuizOption,
    QuizAttempt,
    QuizResponse,
    PhysicalAttendance,
    StudentPerformance,
    LearningResource,
    LearningRecommendation,
    ResourceInteraction,
  ],
})

export { sequelize }
export {
  School,
  Department,
  Program,
  Course,
  Semester,
  CourseSemester,
  Period,
  User,
  RefreshToken,
  PasswordResetToken,
  StudentProfile,
  CourseEnrollment,
  AcademicRecord,
  LecturerProfile,
  CourseAssignment,
  TeachingMaterial,
  Assessment,
  AssessmentSubmission,
  Notification,
  VirtualClass,
  VirtualClassAttendance,
  Quiz,
  QuizQuestion,
  QuizOption,
  QuizAttempt,
  QuizResponse,
  PhysicalAttendance,
  StudentPerformance,
  LearningResource,
  LearningRecommendation,
  ResourceInteraction,
}
