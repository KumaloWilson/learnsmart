import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { LecturerProfile } from "./LecturerProfile"
import { Course } from "./Course"
import { Semester } from "./Semester"

@Table({
  tableName: "teaching_materials",
  timestamps: true,
})
export class TeachingMaterial extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string

  @Column({
    type: DataType.ENUM("lecture_note", "assignment", "resource", "syllabus", "video", "youtube", "other"),
    allowNull: false,
  })
  type!: "lecture_note" | "assignment" | "resource" | "syllabus" | "video" | "youtube" | "other"

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileUrl!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fileName?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fileType?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  fileSize?: number

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  youtubeUrl?: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  videoThumbnail?: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  videoDuration?: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isPublished!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  publishDate?: Date

  @ForeignKey(() => LecturerProfile)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  lecturerProfileId!: string

  @BelongsTo(() => LecturerProfile)
  lecturerProfile?: LecturerProfile

  @ForeignKey(() => Course)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  courseId!: string

  @BelongsTo(() => Course)
  course?: Course

  @ForeignKey(() => Semester)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  semesterId!: string

  @BelongsTo(() => Semester)
  semester?: Semester
}
