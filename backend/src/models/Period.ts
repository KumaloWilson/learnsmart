import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript"
import { Semester } from "./Semester"

@Table({
  tableName: "periods",
  timestamps: true,
})
export class Period extends Model {
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
  name!: string

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startTime!: string

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endTime!: string

  @Column({
    type: DataType.ENUM("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"),
    allowNull: false,
  })
  dayOfWeek!: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

  @ForeignKey(() => Semester)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  semesterId!: string

  @BelongsTo(() => Semester)
  semester?: Semester
}
