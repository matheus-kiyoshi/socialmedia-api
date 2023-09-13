/* 
//   REMEMBER => if you are running the tests and got the unauthorized error, 
//               you need to go to the user.routes.ts and remove the checkToken
*/   

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
    // need jwt
    await request(express)
      .get('/api/users/loginteste')
      .expect(200)
  })
  it('should not find a user', async () => {
    await request(express)
      .get('/api/users/0')
      .expect(404)
  })
  it('should update a user', async () => {
    // need jwt
    await request(express)
      .patch('/api/users/loginteste/profile')
      .send({ nickname: 'loginteste', bio: 'loginteste' }) // icon is optional
      .expect(200)
  })
  it('should find all followers', async () => {
    await request(express)
      .get('/api/users/teste/followers')
      .expect(200)
  })
  it('should follow a user', async () => {
    // need jwt
    const response = await request(express)
      .post('/api/users/teste2/follow')
      .send({
        userToFollow: 'teste4'
      })

    if (response.error) {
      console.log('error -==>', response.error)
    }
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'Now you are following teste4'
    })
  })
  it('should unfollow a user', async () => {
    // need jwt
    const response = await request(express)
      .post('/api/users/teste2/unfollow')
      .send({
        userToUnfollow: 'teste4'
      })

    if (response.error) {
      console.log('error -==>', response.error)
    }
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      message: 'Now you are not following teste4'
    })
  })
})
