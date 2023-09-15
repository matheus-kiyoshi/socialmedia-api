import { HttpException } from '../interfaces/HttpException'
import { EditPost, PostRepository } from '../repositories/PostRepository'
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

  async updatePost(post: EditPost) {
    if (!post.id) {
      throw new HttpException('Post id is required', 400)
    }
    if (!post.authorID) {
      throw new HttpException('Author id is required', 400)
    }
    if (!post.content) {
      throw new HttpException('Content is required', 400)
    }

    const POST = await this.postRepository.findPostById(post.id)
    if (!POST) {
      throw new HttpException('Post not found', 404)
    }
    if (POST?.authorID.toString() !== post.authorID) {
      throw new HttpException('You cannot update this post', 403)
    }

    const result = await this.postRepository.updatePost(post)
    return result
  }

  async deletePost(id: string, authorID: string) {
    if (!id) {
      throw new HttpException('Post id is required', 400)
    }
    if (!authorID) {
      throw new HttpException('Author id is required', 400)
    }

    const post = await this.postRepository.findPostById(id)
    if (!post) {
      throw new HttpException('Post not found', 404)
    }
    if (post?.authorID.toString() !== authorID) {
      throw new HttpException('You cannot delete this post', 403)
    }

    await this.postRepository.deletePost(id)
    return 'Post deleted'
  }

  async findPostById(id: string) {
    const post = await this.postRepository.findPostById(id)
    return post
  }

  async findAllPosts(skipParam?: string) {
    const skip = skipParam ? parseInt(skipParam, 10) : 0

    const posts = await this.postRepository.findAllPosts(skip)
    return posts
  }
}

export { PostUseCases }
