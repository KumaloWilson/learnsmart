import bcrypt from "bcrypt"
import { Department } from "../models/Department"
import { LecturerProfile } from "../models/LecturerProfile"
import { Program } from "../models/Program"
import { School } from "../models/School"
import { StudentProfile } from "../models/StudentProfile"
import { User } from "../models/User"
import sequelize from "../config/sequelize"

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Create admin user
    let adminUser = await User.findOne({ where: { email: "admin@learnsmart.com" } });
    if (!adminUser) {
      console.log('Creating admin user...');
      adminUser = await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@learnsmart.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      });
    } else {
      console.log('Admin user already exists, skipping creation');
    }

    // Create lecturer user
    let lecturerUser = await User.findOne({ where: { email: "lecturer@learnsmart.com" } });
    if (!lecturerUser) {
      console.log('Creating lecturer user...');
      lecturerUser = await User.create({
        firstName: "Lecturer",
        lastName: "User",
        email: "lecturer@learnsmart.com",
        password: await bcrypt.hash("lecturer123", 10),
        role: "lecturer",
      });
    } else {
      console.log('Lecturer user already exists, skipping creation');
    }

    // Helper function to find or create schools
    const findOrCreateSchool = async (schoolData: any) => {
      const existing = await School.findOne({ where: { code: schoolData.code } });
      if (existing) {
        console.log(`School ${schoolData.code} already exists, skipping creation`);
        return existing;
      }
      console.log(`Creating school: ${schoolData.name}`);
      return await School.create(schoolData);
    };

    // Seed schools
    const agricultureSchool = await findOrCreateSchool({
      name: "School of Agricultural Sciences and Technology",
      description:
        "The School of Agricultural Sciences and Technology focuses on agricultural engineering, biotechnology, food science, and more.",
      code: "SAST",
    });

    const businessSchool = await findOrCreateSchool({
      name: "School of Entrepreneurship and Business Sciences",
      description:
        "The School of Entrepreneurship and Business Sciences offers programs in business management, accounting, marketing, and more.",
      code: "SEBS",
    });

    const scienceSchool = await findOrCreateSchool({
      name: "School of Natural Sciences and Mathematics",
      description:
        "The School of Natural Sciences and Mathematics offers programs in biology, chemistry, mathematics, physics, and statistics.",
      code: "SNSM",
    });

    const artSchool = await findOrCreateSchool({
      name: "School of Art and Design",
      description:
        "The School of Art and Design offers programs in fine art, visual communication, creative art, and clothing fashion design.",
      code: "SAD",
    });

    const engineeringSchool = await findOrCreateSchool({
      name: "School of Engineering Science and Technology",
      description:
        "The School of Engineering Science and Technology offers programs in mechatronic engineering, production engineering, information technology, and more.",
      code: "SEST",
    });

    const wildlifeSchool = await findOrCreateSchool({
      name: "School of Wildlife, Ecology and Conservation",
      description:
        "The School of Wildlife, Ecology and Conservation focuses on wildlife ecology, environmental conservation, and freshwater science.",
      code: "SWEC",
    });

    const hospitalitySchool = await findOrCreateSchool({
      name: "School of Hospitality and Tourism",
      description:
        "The School of Hospitality and Tourism offers programs in hospitality, tourism, travel, leisure, and event design.",
      code: "SHT",
    });

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
    ];

    const createdDepartments = [];
    for (const dept of departments) {
      const existingDept = await Department.findOne({ where: { code: dept.code } });
      if (existingDept) {
        console.log(`Department ${dept.code} already exists, skipping creation`);
        createdDepartments.push(existingDept);
      } else {
        console.log(`Creating department: ${dept.name}`);
        const createdDept = await Department.create(dept);
        createdDepartments.push(createdDept);
      }
    }

    // Seed programs
    const itDepartment = createdDepartments.find((dept) => dept.code === "IT");
    if (itDepartment) {
      // Find or create BSc IT program
      let bscIT = await Program.findOne({ 
        where: { 
          code: "BSIT",
          departmentId: itDepartment.id
        } 
      });
      
      if (!bscIT) {
        console.log('Creating BSc IT program...');
        bscIT = await Program.create({
          name: "BSc (Hons) in Information Technology",
          description: "Bachelor of Science in Information Technology",
          code: "BSIT",
          durationYears: 4,
          level: "undergraduate",
          departmentId: itDepartment.id,
        });
      } else {
        console.log('BSc IT program already exists, skipping creation');
      }

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
      ];

      for (const data of studentData) {
        const { firstName, lastName, email, password, role, studentId, programId, enrollmentDate, currentLevel } = data;
        
        // Check if student exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          console.log(`Student with email ${email} already exists, skipping creation`);
          continue;
        }

        // Check if student profile exists
        const existingProfile = await StudentProfile.findOne({ where: { studentId } });
        if (existingProfile) {
          console.log(`Student profile with ID ${studentId} already exists, skipping creation`);
          continue;
        }

        console.log(`Creating student: ${firstName} ${lastName}`);
        const user = await User.create({
          firstName,
          lastName,
          email,
          password,
          role,
        });

        await StudentProfile.create({
          studentId,
          programId,
          enrollmentDate,
          currentLevel,
          userId: user.id,
        });
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
      ];

      for (const data of lecturerData) {
        const { firstName, lastName, email, password, role, staffId, title, specialization, departmentId, joinDate } = data;
        
        // Check if lecturer exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          console.log(`Lecturer with email ${email} already exists, skipping creation`);
          continue;
        }

        // Check if lecturer profile exists
        const existingProfile = await LecturerProfile.findOne({ where: { staffId } });
        if (existingProfile) {
          console.log(`Lecturer profile with ID ${staffId} already exists, skipping creation`);
          continue;
        }

        console.log(`Creating lecturer: ${firstName} ${lastName}`);
        const user = await User.create({
          firstName,
          lastName,
          email,
          password,
          role,
        });

        await LecturerProfile.create({
          staffId,
          title,
          specialization,
          departmentId,
          joinDate,
          userId: user.id,
        });
      }
    }

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();