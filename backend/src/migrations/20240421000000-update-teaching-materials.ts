import { DataTypes, type QueryInterface } from "sequelize"

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // First, modify the type enum to include video and youtube
    await queryInterface.changeColumn("teaching_materials", "type", {
      type: DataTypes.ENUM("lecture_note", "assignment", "resource", "syllabus", "video", "youtube", "other"),
      allowNull: false,
    })

    // Add new columns for YouTube videos
    await queryInterface.addColumn("teaching_materials", "youtubeUrl", {
      type: DataTypes.TEXT,
      allowNull: true,
    })

    await queryInterface.addColumn("teaching_materials", "videoThumbnail", {
      type: DataTypes.TEXT,
      allowNull: true,
    })

    await queryInterface.addColumn("teaching_materials", "videoDuration", {
      type: DataTypes.INTEGER,
      allowNull: true,
    })

    // Make some columns nullable for flexibility
    await queryInterface.changeColumn("teaching_materials", "fileName", {
      type: DataTypes.STRING,
      allowNull: true,
    })

    await queryInterface.changeColumn("teaching_materials", "fileType", {
      type: DataTypes.STRING,
      allowNull: true,
    })
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Remove the added columns
    await queryInterface.removeColumn("teaching_materials", "youtubeUrl")
    await queryInterface.removeColumn("teaching_materials", "videoThumbnail")
    await queryInterface.removeColumn("teaching_materials", "videoDuration")

    // Revert the type enum
    await queryInterface.changeColumn("teaching_materials", "type", {
      type: DataTypes.ENUM("lecture_note", "assignment", "resource", "syllabus", "other"),
      allowNull: false,
    })

    // Make columns non-nullable again
    await queryInterface.changeColumn("teaching_materials", "fileName", {
      type: DataTypes.STRING,
      allowNull: false,
    })

    await queryInterface.changeColumn("teaching_materials", "fileType", {
      type: DataTypes.STRING,
      allowNull: false,
    })
  }
}