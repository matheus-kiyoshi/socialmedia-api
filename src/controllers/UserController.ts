import { NextFunction, Request, Response } from 'express'
import { UserUseCases } from '../useCases/UserUseCases'

class UserController {    
  constructor(private userUseCase: UserUseCases) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body

    try {
      await this.userUseCase.create({
        username,
        password
      })
      return res.status(201).json({ message: 'User created' })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body
    try {
      const user = await this.userUseCase.login(username, password)
      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}

export { UserController }
