import bcrypt from "bcrypt"
import { TokenService } from "./token.service"
import type { RegisterUserDto, LoginDto, AuthResponseDto, ChangePasswordDto } from "../dto/auth.dto"
import { User } from "../models/User"
import { StudentProfile } from "../models/StudentProfile"
import { Program } from "../models/Program"
import { LecturerProfile } from "../models/LecturerProfile"
import { Department } from "../models/Department"
import { AcademicRecord } from "../models/AcademicRecord"
import { Course } from "../models/Course"
import { CourseEnrollment } from "../models/CourseEnrollment"
import { LearningRecommendation } from "../models/LearningRecommendation"
import { LearningResource } from "../models/LearningResource"
import { Semester } from "../models/Semester"
import { Notification } from "../models/Notification"
export class AuthService {
  private tokenService: TokenService

  constructor() {
    this.tokenService = new TokenService()
  }

  async register(userData: RegisterUserDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        email: userData.email,
      },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Create new user
    const user = await User.create(userData as any)

    // Generate tokens
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = await this.tokenService.generateRefreshToken(user)

    
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

 async login(loginData: LoginDto): Promise<AuthResponseDto> {
  // Find user by email
  const user = await User.findOne({
    where: {
      email: loginData.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(loginData.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate tokens
  const accessToken = this.tokenService.generateAccessToken(user);
  const refreshToken = await this.tokenService.generateRefreshToken(user);

  // Prepare base response
  const baseResponse = {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };

  // Fetch additional profile data based on user role
  if (user.role === 'student') {
    // Get active semester for reference throughout
    const activeSemester = await Semester.findOne({
      where: { isActive: true },
    });

    // Find student profile with all relevant associations
    const studentProfile = await StudentProfile.findOne({
      where: { userId: user.id },
      include: [
        {
          model: Program,
          include: [
            { model: Department },
            { model: Course }
          ]
        }
      ]
    });

    if (studentProfile) {
      // Get academic records for the student
      const academicRecords = await AcademicRecord.findAll({
        where: { studentProfileId: studentProfile.id },
        include: [
          {
            model: Semester,
            attributes: ['id', 'name', 'academicYear', 'startDate', 'endDate']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Get current semester academic record
      const currentSemesterPerformance = activeSemester ? 
        academicRecords.find(record => record.semesterId === activeSemester.id) : 
        undefined;

      // Get course enrollments for the active semester
      const currentEnrollments = activeSemester ? 
        await CourseEnrollment.findAll({
          where: { 
            studentProfileId: studentProfile.id,
            semesterId: activeSemester.id
          },
          include: [
            {
              model: Course,
              attributes: ['id', 'name', 'code', 'creditHours', 'description']
            }
          ]
        }) : 
        [];

      // Get learning recommendations
      const learningRecommendations = await LearningRecommendation.findAll({
        where: { studentProfileId: studentProfile.id },
        include: [
          {
            model: LearningResource,
            attributes: ['id', 'title', 'type', 'url', 'difficulty', 'durationMinutes']
          },
          {
            model: Course,
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['relevanceScore', 'DESC']]
      });

      // Get notifications
      const notifications = await Notification.findAll({
        where: { 
          userId: user.id,
          isActive: true
        },
        order: [['createdAt', 'DESC']],
        limit: 50 // Limit to most recent 50 notifications
      });

      // Map all the data to the response format
      return {
        ...baseResponse,
        studentProfile: {
          id: studentProfile.id,
          studentId: studentProfile.studentId,
          status: studentProfile.status,
          currentLevel: studentProfile.currentLevel,
          enrollmentDate: studentProfile.enrollmentDate,
          graduationDate: studentProfile.graduationDate,
          dateOfBirth: studentProfile.dateOfBirth,
          gender: studentProfile.gender,
          address: studentProfile.address,
          phoneNumber: studentProfile.phoneNumber,
          
          // Program details
          programId: studentProfile.programId,
          program: studentProfile.program ? {
            id: studentProfile.program.id,
            name: studentProfile.program.name,
            code: studentProfile.program.code,
            description: studentProfile.program.description,
            durationYears: studentProfile.program.durationYears,
            level: studentProfile.program.level,
            department: studentProfile.program.department,
            courses: studentProfile.program.courses
          } : undefined,

          // Active semester information
          activeSemester: activeSemester ? {
            id: activeSemester.id,
            name: activeSemester.name,
            startDate: activeSemester.startDate,
            endDate: activeSemester.endDate,
            academicYear: activeSemester.academicYear
          } : undefined,

          // Current semester performance
          currentSemesterPerformance: currentSemesterPerformance ? {
            id: currentSemesterPerformance.id,
            gpa: currentSemesterPerformance.gpa,
            cgpa: currentSemesterPerformance.cgpa,
            totalCredits: currentSemesterPerformance.totalCredits,
            earnedCredits: currentSemesterPerformance.earnedCredits,
            remarks: currentSemesterPerformance.remarks
          } : undefined,

          // Academic records history
          academicRecords: academicRecords.map(record => ({
            id: record.id,
            semesterId: record.semesterId,
            semesterName: record.semester?.name,
            academicYear: record.semester?.academicYear,
            gpa: record.gpa,
            cgpa: record.cgpa,
            totalCredits: record.totalCredits,
            earnedCredits: record.earnedCredits,
            remarks: record.remarks
          })),

          // Current semester enrollments
          currentEnrollments: currentEnrollments.map(enrollment => ({
            id: enrollment.id,
            courseId: enrollment.courseId,
            courseName: enrollment.course?.name,
            courseCode: enrollment.course?.code,
            status: enrollment.status,
            grade: enrollment.grade,
            letterGrade: enrollment.letterGrade,
            creditHours: enrollment.course?.creditHours
          })),

          // Learning recommendations
          learningRecommendations: learningRecommendations.map(recommendation => ({
            id: recommendation.id,
            resourceId: recommendation.learningResourceId,
            resourceTitle: recommendation.learningResource?.title,
            resourceType: recommendation.learningResource?.type,
            resourceUrl: recommendation.learningResource?.url,
            courseId: recommendation.courseId,
            courseName: recommendation.course?.name,
            courseCode: recommendation.course?.code,
            relevanceScore: recommendation.relevanceScore,
            isViewed: recommendation.isViewed,
            isSaved: recommendation.isSaved,
            isCompleted: recommendation.isCompleted,
            completedAt: recommendation.completedAt,
            rating: recommendation.rating,
            feedback: recommendation.feedback
          })),

          // Notifications
          notifications: notifications.map(notification => ({
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            isRead: notification.isRead,
            readAt: notification.readAt,
            link: notification.link,
            metadata: notification.metadata,
            createdAt: notification.createdAt
          }))
        }
      };
    }
  } else if (user.role === 'lecturer') {
    const lecturerProfile = await LecturerProfile.findOne({
      where: { userId: user.id },
      include: [{ model: Department }]
    });

    if (lecturerProfile) {
      return {
        ...baseResponse,
        lecturerProfile: {
          id: lecturerProfile.id,
          staffId: lecturerProfile.staffId,
          title: lecturerProfile.title,
          specialization: lecturerProfile.specialization,
          status: lecturerProfile.status,
          joinDate: lecturerProfile.joinDate,
          departmentId: lecturerProfile.departmentId,
          department: lecturerProfile.department,
          bio: lecturerProfile.bio,
          officeLocation: lecturerProfile.officeLocation,
          officeHours: lecturerProfile.officeHours,
          phoneNumber: lecturerProfile.phoneNumber
        }
      };
    }
  }

  // For admin users or if profile not found, return the base response
  return baseResponse;
}


  async refreshToken(token: string): Promise<AuthResponseDto | null> {
    const user = await this.tokenService.verifyRefreshToken(token)

    if (!user) {
      return null
    }

    // Revoke the old refresh token
    await this.tokenService.revokeRefreshToken(token)

    // Generate new tokens
    const accessToken = this.tokenService.generateAccessToken(user)
    const refreshToken = await this.tokenService.generateRefreshToken(user)

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async logout(token: string): Promise<boolean> {
    return this.tokenService.revokeRefreshToken(token)
  }

  async logoutAll(userId: string): Promise<boolean> {
    return this.tokenService.revokeAllUserRefreshTokens(userId)
  }

  async forgotPassword(email: string): Promise<string | null> {
    const user = await User.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return this.tokenService.generatePasswordResetToken(user)
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const user = await this.tokenService.verifyPasswordResetToken(token)

    if (!user) {
      return false
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update user's password
    await user.update({ password: hashedPassword })

    // Mark the token as used
    await this.tokenService.markPasswordResetTokenAsUsed(token)

    return true
  }

  async changePassword(userId: string, data: ChangePasswordDto): Promise<boolean> {
    const user = await User.findByPk(userId)

    if (!user) {
      throw new Error("User not found")
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(data.currentPassword)

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect")
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.newPassword, salt)

    // Update user's password
    await user.update({ password: hashedPassword })

    // Revoke all refresh tokens for security
    await this.tokenService.revokeAllUserRefreshTokens(userId)

    return true
  }

  async getUserProfile(userId: string) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }

  async updateUserProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    const user = await User.findByPk(userId)

    if (!user) {
      throw new Error("User not found")
    }

    return user.update(data)
  }
}
