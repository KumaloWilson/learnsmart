import { Table, Column, Model, DataType, HasMany } from "sequelize-typescript"
import { Department } from "./Department"

@Table({
  tableName: "schools",
  timestamps: true,
})
export class School extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string

  @HasMany(() => Department)
  departments?: Department[]
}
