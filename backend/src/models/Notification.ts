import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { User } from "./User"

@Table({
  tableName: "notifications",
  timestamps: true,
})
export class Notification extends Model {
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
    allowNull: false,
  })
  message!: string

  @Column({
    type: DataType.ENUM(
      "info",
      "success",
      "warning",
      "error",
      "assignment",
      "grade",
      "announcement",
      "enrollment",
      "system",
    ),
    allowNull: false,
    defaultValue: "info",
  })
  type!: "info" | "success" | "warning" | "error" | "assignment" | "grade" | "announcement" | "enrollment" | "system"

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isRead!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  readAt?: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  link?: string

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  metadata?: object

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string

  @BelongsTo(() => User)
  user?: User

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  senderId?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean
}
