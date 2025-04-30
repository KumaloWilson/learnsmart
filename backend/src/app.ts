import express, { type Application, NextFunction, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import "reflect-metadata"
import routes from "./routes"
import sequelize from "./config/sequelize"

// Load environment variables
dotenv.config()

class App {
  public app: Application

  constructor() {
    this.app = express()
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializeErrorHandling()
    this.initializeDatabase()
  }

  private initializeMiddlewares() {
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(morgan("dev"))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private initializeRoutes() {
    this.app.use("/api", routes)
  }

  private initializeErrorHandling() {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack)
      res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      })
    })
  }
  

  private async initializeDatabase() {
    try {
      await sequelize.authenticate()
      console.log("Database connection has been established successfully.")

      // Sync database in development mode
      if (process.env.NODE_ENV === "development") {
        // await sequelize.sync({ alter: true })
        console.log("Database synchronized")
      }
    } catch (error) {
      console.error("Unable to connect to the database:", error)
    }
  }
}

export default new App().app