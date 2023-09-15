import { NextFunction, Request, Response } from 'express'
import { PostUseCases } from '../useCases/PostUseCases'

class postController {
  constructor(private postUseCases: PostUseCases) {}

  async createPost(req: Request, res: Response, next: NextFunction) {
    const { username, content } = req.body
    const files = (req.files as Express.Multer.File[]).map(
      (file) => file.filename
    )

    try {
      const post = await this.postUseCases.createPost({
        authorID: username, 
        content, 
        media: files
      })
      return res.status(201).json(post)
    } catch (error) {
      next(error)
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const { authorID, content } = req.body
    const files = (req.files as Express.Multer.File[]).map(
      (file) => file.filename
    )

    try {
      const post = await this.postUseCases.updatePost({
        id,
        authorID,
        content,
        media: files
      })
      return res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const { authorID } = req.body

    try {
      await this.postUseCases.deletePost(id, authorID)
      return res.status(200).json({ message: 'Post deleted' })
    } catch (error) {
      next(error)
    }
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const { username } = req.body

    try {
      await this.postUseCases.likePost(id, username)
      return res.status(200).json({ message: 'Post liked' })
    } catch (error) {
      next(error)
    }
  }

  async findPostById(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    
    try {
      const post = await this.postUseCases.findPostById(id)
      if (!post) {
        return res.status(404).json({ message: 'Post not found' })
      }

      return res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  async findAllPosts(req: Request, res: Response, next: NextFunction) {
    const skip = req.query.skip as string | undefined

    try {
      const posts = await this.postUseCases.findAllPosts(skip)
      return res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  }
}

export { postController }
