import { Sequelize } from "sequelize"
import { SequelizeStorage, Umzug } from "umzug"
import path from "path"
import dotenv from 'dotenv';

// Load environment variables
dotenv.config()

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
