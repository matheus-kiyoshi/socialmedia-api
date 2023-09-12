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

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { currentPassword, newPassword } = req.body

    try {
      await this.userUseCase.updatePassword(
        username,
        currentPassword,
        newPassword
      )
      return res.status(200).json({ message: 'Password updated' })
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { password } = req.body

    try {
      await this.userUseCase.deleteUser(username, password)
      return res.status(200).json({ message: 'User deleted' })
    } catch (error) {
      next(error)
    }
  }

  async findByUsername(req: Request, res: Response, next: NextFunction) {
    const { username } = req.body

    try {
      const user = await this.userUseCase.findByUsername(username)

      return user
    } catch (error) {
      next(error)
    }
  }

  async findUser(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params

    try {
      const user = await this.userUseCase.findUser(username)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}

export { UserController }
