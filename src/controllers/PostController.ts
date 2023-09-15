import { NextFunction, Request, Response } from 'express'
import { PostUseCases } from '../useCases/PostUseCases'

class postController {
  constructor(private postUseCases: PostUseCases) {}

  async createPost(req: Request, res: Response, next: NextFunction) {
    const { username, content } = req.body
    const files = (req.files as Express.Multer.File[]).map(
      (file) => file.filename
    );

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
