import "reflect-metadata"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { sequelize } from "./models"
import routes from "./routes"

const app = express()

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api", routes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Database connection and server start
const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connection has been established successfully.")

    // Sync database (in development only)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true })
      console.log("Database synced successfully")
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

startServer()

export default app
