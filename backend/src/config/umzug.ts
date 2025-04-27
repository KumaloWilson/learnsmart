import { Sequelize } from "sequelize"
import { SequelizeStorage, Umzug } from "umzug"
import path from "path"
import dotenv from 'dotenv';

// Load environment variables
dotenv.config()

console.log("Initializing Sequelize with the following configuration:")
console.log("DB_HOST:", process.env.DB_HOST || "localhost")
console.log("DB_PORT:", process.env.DB_PORT || "5432")
console.log("DB_USERNAME:", process.env.DB_USERNAME || "postgres")
console.log("DB_NAME:", process.env.DB_NAME || "learn_smart")
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "******" : "not set")
console.log("DB_SSL:", process.env.DB_SSL ? "true" : "false")


const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "learn_smart",
  logging: false,
})

export const migrator = new Umzug({
  migrations: {
    glob: path.join(__dirname, "../migrations/*.ts"),
    resolve: ({ name, path, context }) => {
      const migration = require(path!)
      return {
        name,
        up: async () => migration.default.up(context, Sequelize),
        down: async () => migration.default.down(context, Sequelize),
      }
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

export type Migration = typeof migrator._types.migration
