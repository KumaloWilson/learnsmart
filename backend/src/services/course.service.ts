import type { CreateCourseDto, UpdateCourseDto } from "../dto/course.dto"
import { Course } from "../models/Course"
import { Semester } from "../models/Semester"
import { CourseSemester } from "../models/CourseSemester"
import sequelize from "../config/sequelize"

export class CourseService {
  async findAll() {
    return Course.findAll({
      include: ["program", "semesters"],
    })
  }

  async findById(id: string) {
    return Course.findByPk(id, {
      include: ["program", "semesters"],
    })
  }

  async findByProgram(programId: string) {
    return Course.findAll({
      where: { programId },
      include: ["semesters"],
    })
  }

  async create(data: CreateCourseDto) {
    return Course.create(data as any)
  }

  async update(id: string, data: UpdateCourseDto) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error("Course not found")
    }
    return course.update(data)
  }

  async delete(id: string) {
    const course = await Course.findByPk(id)
    if (!course) {
      throw new Error("Course not found")
    }
    await course.destroy()
    return { message: "Course deleted successfully" }
  }

  async assignToSemester(courseId: string, semesterId: string) {
    // Start a transaction for safety
    const transaction = await sequelize.transaction()
    
    try {
      // Find the course and semester first
      const course = await Course.findByPk(courseId, { transaction })
      if (!course) {
        await transaction.rollback()
        throw new Error("Course not found")
      }
      
      const semester = await Semester.findByPk(semesterId, { transaction })
      if (!semester) {
        await transaction.rollback()
        throw new Error("Semester not found")
      }
      
      console.log(`Attempting to assign course ${courseId} to semester ${semesterId}`)
      
      // Check if the relationship already exists
      const existing = await CourseSemester.findOne({
        where: {
          courseId,
          semesterId
        },
        transaction
      })
      
      if (existing) {
        console.log('Relationship already exists')
        await transaction.commit()
        return { message: "Course is already assigned to this semester" }
      }
      
      // Create the relationship using a direct SQL query if needed
      // This bypasses any potential issues with the ORM layer
      await CourseSemester.create(
        {
          courseId,
          semesterId,
          createdAt: new Date(),
          updatedAt: new Date()
        }, 
        { transaction }
      )
      
      await transaction.commit()
      console.log('Successfully assigned course to semester')
      return { message: "Course assigned to semester successfully" }
    } catch (error) {
      console.error('Error in assignToSemester:', error)
      await transaction.rollback()
      throw error
    }
  }

  async removeFromSemester(courseId: string, semesterId: string) {
    const transaction = await sequelize.transaction()
    
    try {
      // Directly remove from the join table
      const deleted = await CourseSemester.destroy({
        where: {
          courseId,
          semesterId
        },
        transaction
      })
      
      if (deleted === 0) {
        await transaction.rollback()
        throw new Error("Course is not assigned to this semester")
      }
      
      await transaction.commit()
      return { message: "Course removed from semester successfully" }
    } catch (error) {
      console.error('Error in removeFromSemester:', error)
      await transaction.rollback()
      throw error
    }
  }
}