import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
  } from "sequelize-typescript"
  import { Quiz } from "./Quiz"
  import { QuizOption } from "./QuizOption"
  
  @Table({
    tableName: "quiz_questions",
    timestamps: true,
    paranoid: true,
  })
  export class QuizQuestion extends Model {
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
    id!: string
  
    @ForeignKey(() => Quiz)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    quizId!: string
  
    @Column({
      type: DataType.TEXT,
      allowNull: false,
    })
    questionText!: string
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 1,
    })
    points!: number
  
    @Column({
      type: DataType.ENUM("multiple_choice", "true_false", "short_answer", "essay"),
      allowNull: false,
      defaultValue: "multiple_choice",
    })
    questionType!: "multiple_choice" | "true_false" | "short_answer" | "essay"
  
    @Column({
      type: DataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
    isRequired!: boolean
  
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    orderIndex!: number
  
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
    @BelongsTo(() => Quiz)
    quiz!: Quiz
  
    @HasMany(() => QuizOption)
    options!: QuizOption[]
  }
  