import { Router } from 'express'
import { UserRepositoryMongoose } from '../repositories/UserRepositoryMongoose'
import { UserUseCases } from '../useCases/UserUseCases'
import { UserController } from '../controllers/UserController'
import checkToken from '../middlewares/checkToken.middleware'
import { upload } from '../infra/multer'
import path from 'path'

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
    this.router.get('/media/:filename', (req, res) => {
      const filename = req.params.filename;
      res.sendFile(path.join(__dirname, '../tmp/uploads', filename));
    })
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
      '/users',
      this.userController.findAll.bind(this.userController)
    )
    this.router.get(
      '/users/:username',
      this.userController.findUser.bind(this.userController)
    )
    this.router.patch(
      '/profile/password',
      checkToken,
      this.userController.updatePassword.bind(this.userController)
    )
    this.router.patch(
      '/profile',
      checkToken,
      upload.single('icon'),
      this.userController.updateProfile.bind(this.userController)
    )
    this.router.delete(
      '/profile',
      checkToken,
      this.userController.deleteUser.bind(this.userController)
    )
    this.router.post(
      '/users/:userToFollow/follow',
      checkToken,
      this.userController.followUser.bind(this.userController)
    )
    this.router.get(
      '/profile',
      checkToken,
      this.userController.getProfile.bind(this.userController)
    )
    this.router.get(
      '/users/:username/followers',
      this.userController.findAllFollowers.bind(this.userController)
    )
    this.router.get(
      '/users/:username/following',
      this.userController.findAllFollowing.bind(this.userController)
    )
    this.router.delete(
      '/users/:userToUnfollow/unfollow',
      checkToken,
      this.userController.unfollowUser.bind(this.userController)
    )
    this.router.post(
      '/users/:userToBlock/block',
      checkToken,
      this.userController.blockUser.bind(this.userController)
    )
    this.router.get(
      '/blocks',
      checkToken,
      this.userController.findBlockedUsers.bind(this.userController)
    )
    this.router.delete(
      '/users/:userToUnblock/unblock',
      checkToken,
      this.userController.unblockUser.bind(this.userController)
    )
    this.router.post(
      '/users/:username/report',
      checkToken,
      this.userController.reportUser.bind(this.userController)
    )
    this.router.get(
      '/u/search',
      this.userController.searchUsers.bind(this.userController)
    )
  }
}

export { UserRoutes }
