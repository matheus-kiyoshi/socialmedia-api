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
}

export { postController }
