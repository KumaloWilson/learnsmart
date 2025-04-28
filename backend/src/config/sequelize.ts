import { Sequelize } from "sequelize-typescript"
import config from "./database"
import { SequelizeStorage, Umzug } from "umzug"
import path from "path"

const env = process.env.NODE_ENV || "development"
const sequelize = new Sequelize({
  database: config.development.database,
  username: config.development.username,
  password: config.development.password,  
  host: config.development.host,  
  port: config.development.port,  
  dialect: config.development.dialect,
  logging: config.development.logging,
  pool: config.development.pool,
  models: [__dirname + "../models/"],
})

export default sequelize

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
