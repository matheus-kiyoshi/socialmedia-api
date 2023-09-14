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

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { nickname, bio } = req.body
    const file = req.file
    let icon

    if (file) {
      icon = file.filename  
    }

    try {
      await this.userUseCase.updateProfile(username, nickname, bio, icon)
      return res.status(200).json({ message: 'Profile updated' })
    } catch (error) {
      next(error)
    }
  }

  async followUser(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { userToFollow } = req.body
   
    try {
      await this.userUseCase.followUser(username, userToFollow)
      return res.status(200).json({ message: `Now you are following ${userToFollow}` })
    } catch (error) {
      next(error)
    }
  }

  async unfollowUser(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { userToUnfollow } = req.body

    try {
      await this.userUseCase.unfollowUser(username, userToUnfollow)
      return res.status(200).json({ message: `Now you are not following ${userToUnfollow}` })
    } catch (error) {
      next(error)
    }
  }

  async blockUser(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { userToBlock } = req.body

    try {
      await this.userUseCase.blockUser(username, userToBlock)
      return res.status(200).json({ message: `You have blocked ${userToBlock}` })
    } catch (error) {
      next(error)
    }
  }

  async unblockUser(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { userToUnblock } = req.body

    try {
      await this.userUseCase.unblockUser(username, userToUnblock)
      return res.status(200).json({ message: `You have unblocked ${userToUnblock}` })
    } catch (error) {
      next(error)
    }
  }

  async findBlockedUsers(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { skip } = req.body

    try {
      const users = await this.userUseCase.findBlockedUsers(username, skip)
      return res.status(200).json(users)
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

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params

    try {
      const user = await this.userUseCase.findById(id)

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

  async findAllFollowers(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { user, skip } = req.body

    try {
      const users = await this.userUseCase.findAllFollowers(username, user, skip)
      if (!users) {
        return res.status(404).json({ message: 'User not found' })
      }

      return res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async findAllFollowing(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { user, skip } = req.body

    try {
      const users = await this.userUseCase.findAllFollowing(username, user, skip)
      if (!users) {
        return res.status(404).json({ message: 'User not found' })
      } 

      return res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userUseCase.findAll()
      return res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async reportUser(req: Request, res: Response, next: NextFunction) {
    const { username } = req.params
    const { userToReport, reason } = req.body

    try {
      await this.userUseCase.reportUser(username, userToReport, reason)
      return res.status(200).json({ message: 'User reported' })
    } catch (error) {
      next(error)
    }
  }
}

export { UserController }
