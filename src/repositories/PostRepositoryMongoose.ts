import mongoose from 'mongoose'
import { PostRepository } from './PostRepository'
import Post from '../entities/Post'

const PostModel = mongoose.model('Post', new mongoose.Schema({
  _id: {
    type: String,
    default: new mongoose.Types.ObjectId().toString()
  },
  authorID: {
    type: String,
    ref: 'User',
    required: true
  },
  content: String,
  media: {
    type: Array, 
  },
  date: Date,
  coments: {
    type: Array,
    ref: 'Comment'
  },
  likes: {
    type: Array,
    ref: 'User'
  },
  reposts: {
    type: Array,
    ref: 'User'
  },
}))

class PostRepositoryMongoose implements PostRepository {
  async createPost(post: Post): Promise<unknown> {
    const postModel = new PostModel(post)

    await postModel.save()

    return postModel
  }
}

export { PostRepositoryMongoose }
