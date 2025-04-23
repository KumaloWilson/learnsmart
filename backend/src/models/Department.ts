import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from "sequelize-typescript"
import { School } from "./School"
import { Program } from "./Program"

@Table({
  tableName: "departments",
  timestamps: true,
})
export class Department extends Model {
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
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string

  @ForeignKey(() => School)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  schoolId!: string

  @BelongsTo(() => School)
  school?: School

  @HasMany(() => Program)
  programs?: Program[]
}
