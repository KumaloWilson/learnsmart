import { migrator } from "../config/sequelize"

const runMigrations = async () => {
  try {
    await migrator.up()
    console.log("Migrations completed successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error running migrations:", error)
    process.exit(1)
  }
}

runMigrations()
