import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
  } from "sequelize-typescript"
  import { QuizQuestion } from "./QuizQuestion"
  
  @Table({
    tableName: "quiz_options",
    timestamps: true,
    paranoid: true,
  })
  export class QuizOption extends Model {
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
    id!: string
  
    @ForeignKey(() => QuizQuestion)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    questionId!: string
  
    @Column({
      type: DataType.TEXT,
      allowNull: false,
    })
    optionText!: string
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
    isCorrect!: boolean
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    orderIndex!: number
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    explanation?: string
  
    @Column({
      type: DataType.JSONB,
      allowNull: true,
    })
    metadata?: any
  
    @CreatedAt
    createdAt!: Date
  
    @UpdatedAt
    updatedAt!: Date
  
    @DeletedAt
    deletedAt!: Date | null
  
    // Associations
    @BelongsTo(() => QuizQuestion)
    question!: QuizQuestion
  }
  