import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'node:crypto'
import 'dotenv/config'
const app = fastify()

app.get('/db', async (request, reply) => {
  const transactions = await knex('transactions')
    .insert({
      id: randomUUID(),
      title: 'Teste',
      amount: 100,
    })
    .returning('*')
  return transactions
})
app.get('/hello', async (request, reply) => {
  const transactions = await knex('transactions').select('*')
  return transactions
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running on port 3333')
  })
