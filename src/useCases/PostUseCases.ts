import { HttpException } from '../interfaces/HttpException'
import { EditPost, PostRepository } from '../repositories/PostRepository'
import Post from '../entities/Post'
import { UserUseCases } from './UserUseCases'
import nodemailer from 'nodemailer'
import { CommentRepository } from '../repositories/CommentRepository'

class PostUseCases {
  constructor(
    private postRepository: PostRepository,
    private commentRepository: CommentRepository,
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
    if (!result) {
      throw new HttpException('Post not created', 500)
    }
    
    const addPostToUser = await this.userUseCases.addPostToUser(user._id, result._id)
    
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

  async likePost(id: string, username: string) {
    if (!id) {
      throw new HttpException('Post id is required', 400)
    }
    if (!username) {
      throw new HttpException('User id is required', 400)
    }

    // verify if post and user exists
    const post = await this.postRepository.findPostById(id)
    if (!post) {
      throw new HttpException('Post not found', 404)
    }

    const user = await this.userUseCases.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    // verify if author blocked user
    const author = await this.userUseCases.findById(post.authorID)
    if (!author) {
      throw new HttpException('Author not found', 404)
    }
    if (author?.usersBlocked?.includes(user._id)) {
      throw new HttpException('The author has blocked you', 409)
    }
    if (user?.usersBlocked?.includes(author._id)) {
      throw new HttpException('You have blocked the author', 409)
    }

    // verify if user already liked the post
    if (post?.likes?.includes(user._id)) {
      const result = await this.postRepository.unlikePost(post._id, user._id)
      return result
    }

    const result = await this.postRepository.likePost(post._id, user._id)
    return result
  }

  async rePost(id: string, username: string, content: string) {
    if (!id) {
      throw new HttpException('Post id is required', 400)
    }
    if (!username) {
      throw new HttpException('User id is required', 400)
    }
    if (!content) {
      content = ''
    }
    
    const post = await this.postRepository.findPostById(id)
    if (!post) {
      throw new HttpException('Post not found', 404)
    }

    const user = await this.userUseCases.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    // verify if user blocked author
    if (user.usersBlocked?.includes(post.authorID)) {
      throw new HttpException('You have blocked the author', 409)
    }

    // verify if author blocked user
    const author = await this.userUseCases.findById(post.authorID)
    if (author) {
      if (author.usersBlocked?.includes(user._id)) {
        throw new HttpException('The author has blocked you', 409)
      }
    }

    let reposts
    if (user.reposts) {
      reposts = await this.postRepository.findUserReposts(user.reposts)

      // verify if author already reposted
      reposts?.map((repost) => {
        if (repost.originalPost === post._id) {
          throw new HttpException('You already reposted this post', 409)
        }
      })
    }


    const POST = {
      authorID: user._id,
      content: content,
      date: new Date(),
      likes: [],
      reposts: [],
      coments: []
    }

    const result = await this.postRepository.rePost(POST, post._id)
    if (!result) {
      throw new HttpException('Post not reposted', 500)
    }

    await this.userUseCases.addRepostToUser(user._id, result._id)

    return result
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

  async reportUser(username: string, id: string, reason: string) {
    if (!username) {
      throw new HttpException('Username is required', 404)
    }
    if (!id) {
      throw new HttpException('id to report is required', 404)
    }
    if (!reason) {
      throw new HttpException('Reason is required', 404)
    }

    const post = await this.postRepository.findPostById(id)
    if (!post) {
      throw new HttpException('Post not found', 404)
    }

    const user = await this.userUseCases.findById(post.authorID)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECEIVER,
        subject: `Report post from ${user.username}`,
        text: `Post ID: ${post._id}\nUser ID: ${user._id}\nReason: ${reason}`,
      }
      
      return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error', error)
        } else {
          console.log('Email sent', info.response)
        }
      })
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }

  // COMMENT CASES

  async createComment(originalPostID: string, post: Post) {
    if (!originalPostID) {
      throw new HttpException('Post id is required', 400)
    }
    if (!post.authorID) {
      throw new HttpException('Username is required', 400)
    }
    if (!post.content) {
      throw new HttpException('Content is required', 400)
    }

    const originalPost = await this.postRepository.findPostById(originalPostID)
    if (!originalPost) {
      throw new HttpException('Post not found', 404)
    }

    const user = await this.userUseCases.findByUsername(post.authorID)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    // verify if user blocked author
    if (user.usersBlocked?.includes(originalPost.authorID)) {
      throw new HttpException('You have blocked the author', 409)
    }

    // verify if author blocked user
    const author = await this.userUseCases.findById(originalPost.authorID)
    if (author) {
      if (author.usersBlocked?.includes(user._id)) {
        throw new HttpException('The author has blocked you', 409)
      }
    }

    // default attributes
    post.authorID = user._id
    post.date = new Date()
    post.likes = []
    post.reposts = []
    post.coments = []
    post.originalPost = originalPost._id

    const result = await this.commentRepository.createComment(post)
    if (!result) {
      throw new HttpException('Comment not created', 500)
    }

    await this.postRepository.addCommentToPost(originalPostID, result._id)
    await this.userUseCases.addPostToUser(user._id, result._id)
    
    return result
  }
}

export { PostUseCases }
