import { Sequelize } from "sequelize-typescript"
import config from "./database"
import { SequelizeStorage, Umzug } from "umzug"
import path from "path"
import { AcademicRecord } from "../models/AcademicRecord"
import { Assessment } from "../models/Assessment"
import { AssessmentSubmission } from "../models/AssessmentSubmission"
import { AtRiskStudent } from "../models/AtRiskStudent"
import { Course } from "../models/Course"
import { CourseAssignment } from "../models/CourseAssignment"
import { CourseEnrollment } from "../models/CourseEnrollment"
import { CourseMastery } from "../models/CourseMastery"
import { CourseSemester } from "../models/CourseSemester"
import { CourseTopic } from "../models/CourseTopic"
import { Department } from "../models/Department"
import { LearningRecommendation } from "../models/LearningRecommendation"
import { LearningResource } from "../models/LearningResource"
import { LecturerProfile } from "../models/LecturerProfile"
import { Notification } from "../models/Notification"
import { PasswordResetToken } from "../models/PasswordResetToken"
import { Period } from '../models/Period';
import { PhysicalAttendance } from "../models/PhysicalAttendance"
import { Program } from "../models/Program"
import { Quiz } from "../models/Quiz"
import { QuizAttempt } from "../models/QuizAttempt"
import { QuizOption } from "../models/QuizOption"
import { QuizQuestion } from "../models/QuizQuestion"
import { QuizResponse } from "../models/QuizResponse"
import { RefreshToken } from "../models/RefreshToken"
import { ResourceInteraction } from "../models/ResourceInteraction"
import { School } from "../models/School"
import { Semester } from "../models/Semester"
import { StudentPerformance } from "../models/StudentPerformance"
import { StudentProfile } from "../models/StudentProfile"
import { TeachingMaterial } from "../models/TeachingMaterial"
import { TopicProgress } from "../models/TopicProgress"
import { User } from "../models/User"
import { VirtualClass } from "../models/VirtualClass"
import { VirtualClassAttendance } from "../models/VirtualClassAttendance"


const env = process.env.NODE_ENV || "development"
const sequelize = new Sequelize({
  database: config.development.database,
  username: config.development.username,
  password: config.development.password,  
  host: config.development.host,  
  port: config.development.port,  
  dialect: config.development.dialect,
  logging: config.development.logging,
  pool: config.development.pool,
  models: [
    AcademicRecord,
    Assessment,
    AssessmentSubmission,
    AtRiskStudent,
    Course,
    CourseAssignment,
    CourseEnrollment,
    CourseMastery,
    CourseSemester,
    CourseTopic,
    Department,
    LearningRecommendation,
    LearningResource,
    LecturerProfile,
    Notification,
    PasswordResetToken,
    Period,
    PhysicalAttendance,
    Program,
    Quiz,
    QuizAttempt,
    QuizOption,
    QuizQuestion,
    QuizResponse,
    RefreshToken,
    ResourceInteraction,
    School,
    Semester,
    StudentPerformance,
    StudentProfile,
    TeachingMaterial,
    TopicProgress,
    User,
    VirtualClass,
    VirtualClassAttendance
  ],
})

export default sequelize

export const migrator = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../migrations/*.ts"),
    resolve: ({ name, path, context }) => {
      const migration = require(path!)
      return {
        name,
        up: async () => migration.default.up(context, Sequelize),
        down: async () => migration.default.down(context, Sequelize),
      }
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

export type Migration = typeof migrator._types.migration
