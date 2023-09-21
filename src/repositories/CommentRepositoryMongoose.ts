import mongoose from 'mongoose'
import { CommentRepository, PostWithID } from './CommentRepository'
import Post from '../entities/Post'

const CommentModel = mongoose.model('Comment', new mongoose.Schema({
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
  wasEdited: {
    type: Boolean,
    default: false
  },
  isReposted: {
    type: Boolean,
    default: false
  },
  originalPost: {
    type: String,
    default: null
  }
}))

class CommentRepositoryMongoose implements CommentRepository {
	async createComment(post: Post): Promise<PostWithID | undefined> {
		const commentModel = new CommentModel(post)

		await commentModel.save()

		return commentModel ? commentModel.toObject() : undefined
	}
}

export { CommentRepositoryMongoose }
