import { App } from '../app'
import User from '../entities/User'
import request from 'supertest'
import crypto from 'node:crypto'

const app = new App()
const express = app.app

const user: User = {
  username: crypto.randomBytes(4).toString('hex'),
  password: crypto.randomBytes(10).toString('hex')
}

describe('User Controller', () => {
  it('should create a new user', async () => {
    await request(express)
      .post('/api/register')
      .send(user)
      .expect(201)
  })
  it('should login a user', async () => {
    await request(express)
      .post('/api/login')
      .send({ username: 'loginteste', password: 'passeiopau' })
      .expect(200)
  })
  it('should be unauthorized', async () => {
    // need jwt
    await request(express)
      .patch('/api/users/loginteste/password')
      .send({ currentPassword: 'passeiopau', newPassword: 'passeiopau2' })
      .expect(401)
  })
  it('should find a user', async () => {
    await request(express)
      .get('/api/users/loginteste')
      .expect(200)
  })
  it('should not find a user', async () => {
    await request(express)
      .get('/api/users/0')
      .expect(404)
  })
})
