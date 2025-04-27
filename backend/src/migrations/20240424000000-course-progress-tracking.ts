import { type QueryInterface, DataTypes } from "sequelize"

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Create course_topics table
    await queryInterface.createTable("course_topics", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      durationHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      learningObjectives: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      keywords: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      difficulty: {
        type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
        allowNull: false,
        defaultValue: "intermediate",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      semesterId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "semesters",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })

    // Create topic_progress table
    await queryInterface.createTable("topic_progress", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "student_profiles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      courseTopicId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "course_topics",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      masteryLevel: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      timeSpentMinutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      assessmentResults: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })

    // Create course_masteries table
    await queryInterface.createTable("course_masteries", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "student_profiles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      semesterId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "semesters",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      masteryLevel: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      quizAverage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      assignmentAverage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      topicCompletionPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalTopicsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalTopics: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })

    // Create at_risk_students table
    await queryInterface.createTable("at_risk_students", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentProfileId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "student_profiles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      semesterId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "semesters",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      riskScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      riskLevel: {
        type: DataTypes.ENUM("low", "medium", "high", "critical"),
        allowNull: false,
      },
      riskFactors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      recommendedActions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      aiAnalysis: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      isResolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resolutionNotes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })

    // Add indexes
    await queryInterface.addIndex("course_topics", ["courseId", "semesterId"])
    await queryInterface.addIndex("topic_progress", ["studentProfileId", "courseTopicId"])
    await queryInterface.addIndex("course_masteries", ["studentProfileId", "courseId", "semesterId"])
    await queryInterface.addIndex("at_risk_students", ["studentProfileId", "courseId", "semesterId"])
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("at_risk_students")
    await queryInterface.dropTable("course_masteries")
    await queryInterface.dropTable("topic_progress")
    await queryInterface.dropTable("course_topics")
  },
}
