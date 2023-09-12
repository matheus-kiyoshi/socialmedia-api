import { NextFunction, Request, Response } from 'express'
import { errorMiddleware } from '../middlewares/error.middleware'
import { HttpException } from '../interfaces/HttpException'

describe('Error Middleware test', () => {
  it('Should respond with the correct status and message HttpException', () => {
    const httpException: HttpException = {
      name: 'HttpException',
      statusCode: 404,
      message: 'Not Found'
    }

    const req: Partial<Request> = {}
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const next: NextFunction = jest.fn()

    errorMiddleware(httpException, req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      message: 'Not Found'
    })
  })
  it('Should respond with the correct status and message HttpException', () => {
    const httpException: HttpException = {
      name: 'HttpException',
      statusCode: 500,
      message: 'Internal Server Error'
    }

    const req: Partial<Request> = {}
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const next: NextFunction = jest.fn()

    errorMiddleware(httpException, req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Internal Server Error'
    })
  })
})
