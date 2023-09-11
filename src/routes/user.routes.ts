import { Router } from 'express'
import { UserRepositoryMongoose } from '../repositories/UserRepositoryMongoose'
import { UserUseCases } from '../useCases/UserUseCases'
import { UserController } from '../controllers/UserController'

class UserRoutes {
  public router: Router
  private userController: UserController
  constructor() {
    this.router = Router()
    const userRepository = new UserRepositoryMongoose()
    const userUseCases = new UserUseCases(userRepository)
    this.userController = new UserController(userUseCases)
    this.initRoutes()
  }

  initRoutes() {
    // default route => /api/
    this.router.post(
      '/register',
      this.userController.create.bind(this.userController)
    )
    // this.router.post(
    //   '/login',
    //   this.userController.login.bind(this.userController)
    // )
  }
}

export { UserRoutes }