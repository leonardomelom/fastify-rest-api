import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Transaction', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback')
    execSync('npm run knex migrate:latest')
  })

  it('Should be able to create a transaction', async () => {
    await request(app.server)
      .post('/transaction/create')
      .send({
        title: 'teste',
        amount: 1000,
        type: 'credit',
      })
      .expect(201)
  })

  it('Should be able to get all transactions', async () => {
    const createTransactioResponse = await request(app.server)
      .post('/transaction/create')
      .send({
        title: 'teste',
        amount: 1000,
        type: 'credit',
      })

    const cookies = createTransactioResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transaction')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'teste',
        amount: 1000,
      }),
    ])
  })

  it('Should be able to get a especific transaction', async () => {
    const createTransactioResponse = await request(app.server)
      .post('/transaction/create')
      .send({
        title: 'teste',
        amount: 1000,
        type: 'credit',
      })

    const cookies = createTransactioResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transaction')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transaction/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'teste',
        amount: 1000,
      }),
    )
  })

  it('Should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transaction/create')
      .send({
        title: 'teste',
        amount: 1000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transaction/create')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: -2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transaction/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    })
  })
})
