// eslint-disable-next-line prettier/prettier, no-unused-vars
import Knex from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      type: string
      session_id: string
    }
  }
}
