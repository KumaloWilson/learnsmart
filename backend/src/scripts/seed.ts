import { sequelize, School, Department, Program, StudentProfile, LecturerProfile } from "../models"
import bcrypt from "bcrypt"

const seedDatabase = async () => {
  try {
    // Create admin user
    const adminUser = await sequelize.models.User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@learnsmart.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    })

    // Create lecturer user
    const lecturerUser = await sequelize.models.User.create({
      firstName: "Lecturer",
      lastName: "User",
      email: "lecturer@learnsmart.com",
      password: await bcrypt.hash("lecturer123", 10),
      role: "lecturer",
    })

    // Seed schools
    const agricultureSchool = await School.create({
      name: "School of Agricultural Sciences and Technology",
      description:
        "The School of Agricultural Sciences and Technology focuses on agricultural engineering, biotechnology, food science, and more.",
      code: "SAST",
    })

    const businessSchool = await School.create({
      name: "School of Entrepreneurship and Business Sciences",
      description:
        "The School of Entrepreneurship and Business Sciences offers programs in business management, accounting, marketing, and more.",
      code: "SEBS",
    })

    const scienceSchool = await School.create({
      name: "School of Natural Sciences and Mathematics",
      description:
        "The School of Natural Sciences and Mathematics offers programs in biology, chemistry, mathematics, physics, and statistics.",
      code: "SNSM",
    })

    const artSchool = await School.create({
      name: "School of Art and Design",
      description:
        "The School of Art and Design offers programs in fine art, visual communication, creative art, and clothing fashion design.",
      code: "SAD",
    })

    const engineeringSchool = await School.create({
      name: "School of Engineering Science and Technology",
      description:
        "The School of Engineering Science and Technology offers programs in mechatronic engineering, production engineering, information technology, and more.",
      code: "SEST",
    })

    const wildlifeSchool = await School.create({
      name: "School of Wildlife, Ecology and Conservation",
      description:
        "The School of Wildlife, Ecology and Conservation focuses on wildlife ecology, environmental conservation, and freshwater science.",
      code: "SWEC",
    })

    const hospitalitySchool = await School.create({
      name: "School of Hospitality and Tourism",
      description:
        "The School of Hospitality and Tourism offers programs in hospitality, tourism, travel, leisure, and event design.",
      code: "SHT",
    })

    // Seed departments for School of Agricultural Sciences and Technology
    const departments = [
      {
        name: "Agricultural Engineering",
        description: "Department focused on agricultural engineering and technology.",
        code: "AGENG",
        schoolId: agricultureSchool.id,
      },
      {
        name: "Biotechnology",
        description: "Department focused on biotechnology research and applications.",
        code: "BIOTECH",
        schoolId: agricultureSchool.id,
      },
      {
        name: "Food Science and Technology",
        description: "Department focused on food science and technology.",
        code: "FOODSCI",
        schoolId: agricultureSchool.id,
      },
      {
        name: "Crop Science and Post-Harvest Technology",
        description: "Department focused on crop science and post-harvest technology.",
        code: "CROPSCI",
        schoolId: agricultureSchool.id,
      },
      {
        name: "Animal Production and Technology",
        description: "Department focused on animal production and technology.",
        code: "ANIPROD",
        schoolId: agricultureSchool.id,
      },
      {
        name: "Environmental Science and Technology",
        description: "Department focused on environmental science and technology.",
        code: "ENVSCI",
        schoolId: agricultureSchool.id,
      },
      {
        name: "Information Technology",
        description: "Department focused on information technology and computer science.",
        code: "IT",
        schoolId: engineeringSchool.id,
      },
    ]

    const createdDepartments = []
    for (const dept of departments) {
      const createdDept = await Department.create(dept)
      createdDepartments.push(createdDept)
    }

    // Seed programs
    const itDepartment = createdDepartments.find((dept) => dept.code === "IT")
    if (itDepartment) {
      const bscIT = await Program.create({
        name: "BSc (Hons) in Information Technology",
        description: "Bachelor of Science in Information Technology",
        code: "BSCIT",
        durationYears: 4,
        level: "undergraduate",
        departmentId: itDepartment.id,
      })

      // Create student users and profiles
      const studentData = [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@student.learnsmart.com",
          password: await bcrypt.hash("student123", 10),
          role: "student",
          studentId: "IT/2023/001",
          programId: bscIT.id,
          enrollmentDate: new Date(2023, 8, 1), // September 1, 2023
          currentLevel: 1,
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@student.learnsmart.com",
          password: await bcrypt.hash("student123", 10),
          role: "student",
          studentId: "IT/2023/002",
          programId: bscIT.id,
          enrollmentDate: new Date(2023, 8, 1), // September 1, 2023
          currentLevel: 1,
        },
      ]

      for (const data of studentData) {
        const { firstName, lastName, email, password, role, studentId, programId, enrollmentDate, currentLevel } = data
        const user = await sequelize.models.User.create({
          firstName,
          lastName,
          email,
          password,
          role,
        })

        await StudentProfile.create({
          studentId,
          programId,
          enrollmentDate,
          currentLevel,
          userId: user.id,
        })
      }

      // Create lecturer profiles
      const lecturerData = [
        {
          firstName: "Robert",
          lastName: "Johnson",
          email: "robert.johnson@lecturer.learnsmart.com",
          password: await bcrypt.hash("lecturer123", 10),
          role: "lecturer",
          staffId: "IT/STAFF/2023/001",
          title: "Dr.",
          specialization: "Computer Science",
          departmentId: itDepartment.id,
          joinDate: new Date(2023, 1, 1), // February 1, 2023
        },
        {
          firstName: "Sarah",
          lastName: "Williams",
          email: "sarah.williams@lecturer.learnsmart.com",
          password: await bcrypt.hash("lecturer123", 10),
          role: "lecturer",
          staffId: "IT/STAFF/2023/002",
          title: "Prof.",
          specialization: "Software Engineering",
          departmentId: itDepartment.id,
          joinDate: new Date(2023, 1, 15), // February 15, 2023
        },
      ]

      for (const data of lecturerData) {
        const { firstName, lastName, email, password, role, staffId, title, specialization, departmentId, joinDate } =
          data
        const user = await sequelize.models.User.create({
          firstName,
          lastName,
          email,
          password,
          role,
        })

        await LecturerProfile.create({
          staffId,
          title,
          specialization,
          departmentId,
          joinDate,
          userId: user.id,
        })
      }
    }

    console.log("Database seeded successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
