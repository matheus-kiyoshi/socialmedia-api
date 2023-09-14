import { HttpException } from '../interfaces/HttpException'
import { PostRepository } from '../repositories/PostRepository'
import Post from '../entities/Post'
import { UserUseCases } from './UserUseCases'

class PostUseCases {
  constructor(
    private postRepository: PostRepository,
    private userUseCases: UserUseCases
  ) {}

  async createPost(post: Post) {
    if (!post.authorID) {
      throw new HttpException('Username is required', 400)
    }
    if (!post.content) {
      throw new HttpException('Content is required', 400)
    }

    const user = await this.userUseCases.findByUsername(post.authorID)
    if (!user) {
      throw new HttpException('User not found', 404)
    }
    
    // default attributes
    post.authorID = user._id
    post.date = new Date()
    post.likes = []
    post.reposts = []
    post.coments = []
    
    const result = await this.postRepository.createPost(post)
    return result
  }
}

export { PostUseCases }
