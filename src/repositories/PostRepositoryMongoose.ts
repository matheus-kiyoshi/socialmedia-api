import mongoose from 'mongoose'
import { EditPost, PostRepository, PostWithID } from './PostRepository'
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

class PostRepositoryMongoose implements PostRepository {
  async createPost(post: Post): Promise<unknown> {
    const postModel = new PostModel(post)

    await postModel.save()

    return postModel
  }

  async updatePost(post: EditPost): Promise<PostWithID | undefined> {
    const postModel = await PostModel.findByIdAndUpdate(
      post.id,
      {
        $set: {
          content: post.content,
          media: post.media,
          wasEdited: true
        }
      },
      { new: true }
    ).select('-__v').exec()

    return postModel ? postModel.toObject() : undefined
  }

  async deletePost(id: string): Promise<string> {
    try {
      await PostModel.findByIdAndDelete(id).exec()
      return 'Post deleted'
    } catch (error) {
      throw error
    }
  }

  async likePost(postID: string, userID: string): Promise<string> {
    const postModel = await PostModel.findByIdAndUpdate(
      postID,
      {
        $push: {
          likes: userID
        }
      },
      { new: true }
    )

    return 'Post liked'
  }

  async unlikePost(postID: string, userID: string): Promise<string> {
    const postModel = await PostModel.findByIdAndUpdate(
      postID,
      {
        $pull: {
          likes: userID
        }
      },
      { new: true }
    )

    return 'Post unliked'
  }

  async rePost(post: Post, postID: string): Promise<string> {
    const postModel = new PostModel(post)
    postModel.isReposted = true
    postModel.originalPost = postID
    console.log(postModel)
    await postModel.save()

    return 'Post reposted'
  }

  async findPostById(id: string): Promise<PostWithID | undefined> {
    const post = await PostModel.findById(id).select('-__v').exec()

    return post ? post.toObject() : undefined
  }

  async findAllPosts(skip: number): Promise<PostWithID[] | undefined> {
    const posts = await PostModel.find().select('-__v').skip(skip).limit(20).exec()

    return posts ? posts.map((post) => post.toObject()) : undefined
  }
}

export { PostRepositoryMongoose }
