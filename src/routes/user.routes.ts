import { Router } from 'express'
import { UserRepositoryMongoose } from '../repositories/UserRepositoryMongoose'
import { UserUseCases } from '../useCases/UserUseCases'
import { UserController } from '../controllers/UserController'
import checkToken from '../middlewares/checkToken.middleware'
import { upload } from '../infra/multer'

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
    // TODO: change the response -> id to username
    this.router.post(
      '/login',
      this.userController.login.bind(this.userController)
    )
    this.router.get(
      '/users/:username',
      this.userController.findUser.bind(this.userController)
    )
    this.router.patch(
      '/users/:username/password',
      checkToken,
      this.userController.updatePassword.bind(this.userController)
    )
    this.router.patch(
      '/users/:username/profile',
      checkToken,
      upload.single('icon'),
      this.userController.updateProfile.bind(this.userController)
    )
    this.router.delete(
      '/users/:username',
      checkToken,
      this.userController.deleteUser.bind(this.userController)
    )
    this.router.post(
      '/users/:username/follow',
      this.userController.followUser.bind(this.userController)
    )
  }
}

export { UserRoutes }