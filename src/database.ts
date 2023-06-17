import Knex, { Knex as KnexType } from 'knex'
import { env } from './env'

export const config: KnexType.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL as string,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const knex = Knex(config)
