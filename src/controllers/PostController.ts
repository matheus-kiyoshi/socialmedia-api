import { NextFunction, Request, Response } from 'express'
import { PostUseCases } from '../useCases/PostUseCases'

class postController {
  constructor(private postUseCases: PostUseCases) {}

  async createPost(req: Request, res: Response, next: NextFunction) {
    const { username } = req.user
    const { content } = req.body
    let files
    if (req.files) {
      files = (req.files as Express.Multer.File[]).map(
        (file) => file.filename
      )
    }

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
    const { id: authorID } = req.params
    const id = req.params.id
    const { content } = req.body
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
    const { id: authorID } = req.user

    try {
      await this.postUseCases.deletePost(id, authorID)
      return res.status(200).json({ message: 'Post deleted' })
    } catch (error) {
      next(error)
    }
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id
    const { username } = req.user

    try {
      const result = await this.postUseCases.likePost(id, username)
      return res.status(200).json({ message: result })
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

  async rePost(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const { username } = req.user
    const { content } = req.body
    let files
    if (req.files) {
      files = (req.files as Express.Multer.File[]).map(
        (file) => file.filename
      )
    }
    
    try {
      const result = await this.postUseCases.rePost(id, username, content, files)
      return res.status(200).json({ message: result })
    } catch (error) {
      next(error)
    }
  }

  async reportPost(req: Request, res: Response, next: NextFunction) {
    const { username } = req.user
    const { id } = req.params
    const { reason } = req.body

    try {
      await this.postUseCases.reportUser(username, id, reason)
      return res.status(200).json({ message: 'Post reported' })
    } catch (error) {
      next(error)
    }
  }

  async createComment(req: Request, res: Response, next: NextFunction) {
    const { username } = req.user
    const { id } = req.params
    const { content } = req.body
    let files
    if (req.files) {
      files = (req.files as Express.Multer.File[]).map(
        (file) => file.filename
      )
    }

    try {
      const post = await this.postUseCases.createComment(id, {
        authorID: username, 
        content, 
        media: files
      })
      return res.status(201).json(post)
    } catch (error) {
      next(error)
    }
  }

  async findAllPostComments(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params
    const skip = req.query.skip as string | undefined
    
    try {
      const comments = await this.postUseCases.findAllPostComments(id, skip)
      return res.status(200).json(comments)
    } catch (error) {
      next(error)
    }
  }

  async searchPosts(req: Request, res: Response, next: NextFunction) {
    const query = req.query.q as string

    try {
      const posts = await this.postUseCases.searchPosts(query)
      return res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  }
}

export { postController }
