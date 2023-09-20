import { Router } from 'express'
import { postController } from '../controllers/PostController'
import { PostRepositoryMongoose } from '../repositories/PostRepositoryMongoose'
import { PostUseCases } from '../useCases/PostUseCases'
import { upload } from '../infra/multer'
import checkToken from '../middlewares/checkToken.middleware'
import { UserUseCases } from '../useCases/UserUseCases'
import { UserRepositoryMongoose } from '../repositories/UserRepositoryMongoose'

class PostRoutes {
	public router: Router
	private postController: postController
	constructor() {
		this.router = Router()
		const userRepository = new UserRepositoryMongoose()
		const userUseCases = new UserUseCases(userRepository)
		const postRepository = new PostRepositoryMongoose()
		const postUseCases = new PostUseCases(postRepository, userUseCases)
		this.postController = new postController(postUseCases)
		this.initRoutes()
	}

	initRoutes() {
		// default route => /api/
		this.router.post(
			'/posts',
			checkToken,
			upload.array('media', 4),
			this.postController.createPost.bind(this.postController)
		)
		this.router.get(
			'/posts',
			this.postController.findAllPosts.bind(this.postController)
		)
		this.router.get(
			'/posts/:id',
			this.postController.findPostById.bind(this.postController)
		)
		this.router.patch(
			'/posts/:id',
			checkToken,
			upload.array('media', 4),
			this.postController.updatePost.bind(this.postController)
		)
		this.router.delete(
			'/posts/:id',
			checkToken,
			this.postController.deletePost.bind(this.postController)
		)
		this.router.post(
			'/posts/:id/like',
			checkToken,
			this.postController.likePost.bind(this.postController)
		)
		this.router.post(
			'/posts/:id/repost',
			checkToken,
			this.postController.rePost.bind(this.postController)
		)
		this.router.post(
			'/posts/:id/report',
			checkToken,
			this.postController.reportPost.bind(this.postController)
		)
	}
}

export { PostRoutes }
