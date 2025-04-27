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
  import { QuizAttempt } from "./QuizAttempt"
  import { QuizQuestion } from "./QuizQuestion"
  import { QuizOption } from "./QuizOption"
  
  @Table({
    tableName: "quiz_responses",
    timestamps: true,
    paranoid: true,
  })
  export class QuizResponse extends Model {
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
    id!: string
  
    @ForeignKey(() => QuizAttempt)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    attemptId!: string
  
    @ForeignKey(() => QuizQuestion)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    questionId!: string
  
    @ForeignKey(() => QuizOption)
    @Column({
      type: DataType.UUID,
      allowNull: true,
    })
    selectedOptionId?: string
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    textResponse?: string
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: true,
    })
    booleanResponse?: boolean
  
    @Column({
      type: DataType.FLOAT,
      allowNull: true,
    })
    pointsAwarded?: number
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
    isCorrect!: boolean
  
    @Column({
      type: DataType.TEXT,
      allowNull: true,
    })
    feedback?: string
  
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
    @BelongsTo(() => QuizAttempt)
    attempt!: QuizAttempt
  
    @BelongsTo(() => QuizQuestion)
    question!: QuizQuestion
  
    @BelongsTo(() => QuizOption)
    selectedOption?: QuizOption
  }
  