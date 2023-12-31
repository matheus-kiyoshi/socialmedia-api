import mongoose from 'mongoose'
import { EditPost, PostRepository, PostWithID, repostValidation } from './PostRepository'
import Post from '../entities/Post'

const PostModel = mongoose.model('Post', new mongoose.Schema({
  authorID: {
    type: String,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
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
  repostsAuthorId: {
    type: Array,
    ref: 'User',
  },
  wasEdited: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'post'
  },
  originalPost: {
    type: String,
    default: null
  }
}))

class PostRepositoryMongoose implements PostRepository {
  async createPost(post: Post): Promise<PostWithID | undefined> {
    const postModel = new PostModel(post)

    await postModel.save()

    return postModel ? postModel.toObject() : undefined
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

  async rePost(post: Post, postID: string): Promise<PostWithID | undefined> {
    const postModel = new PostModel(post)
    postModel.type = 'repost'
    postModel.originalPost = postID

    await postModel.save()

    const postReposted = await PostModel.findByIdAndUpdate(
      postID,
      {
        $push: {
          reposts: postModel._id
        }
      },
      { new: true }
    )

    return postModel ? postModel.toObject() : undefined
  }

  async createComment(post: Post): Promise<PostWithID | undefined> {
		const postModel = new PostModel(post)
    postModel.type = 'comment'

		await postModel.save()

		return postModel ? postModel.toObject() : undefined
	}

  async addCommentToPost(postID: string, commentID: string): Promise<string> {
    const postModel = await PostModel.findByIdAndUpdate(
      postID,
      {
        $push: {
          coments: commentID
        }
      },
      { new: true }
    )

    return 'Comment added'
  }

  async addRepostAuthorToPost(postID: string, userID: string): Promise<string> {
    const postModel = await PostModel.findByIdAndUpdate(
      postID,
      {
        $push: {
          repostsAuthorId: userID
        }
      },
      { new: true }
    )

    return 'Repost author added'
  }

  async removeRepostFromPost(originalPostID: string, postID: string, userID: string): Promise<string> {
    try {
      const postObjectId = new mongoose.Types.ObjectId(postID)
      const userObjectId = new mongoose.Types.ObjectId(userID)

      const postModel = await PostModel.findByIdAndUpdate(
        originalPostID,
        {
          $pull: {
            reposts: postObjectId,
            repostsAuthorId: userObjectId
          }
        },
        { new: true }
      )

      if (!postModel) {
        return 'Post not found'
      }

      return 'Repost removed'
    } catch (error) {
      return 'Error removing repost'
    }
  }

  async removeCommentFromPost(postID: string, commentID: string): Promise<string> {
    try {
      const objectId = new mongoose.Types.ObjectId(commentID)

      const postModel = await PostModel.findByIdAndUpdate(
        postID,
        {
          $pull: {
            coments: objectId
          }
        },
        { new: true }
      )

      if (!postModel) {
        return 'Post not found'
      }

      return 'Comment removed'
    } catch (error) {
      return 'Error removing comment'
    }
  }

  async findAllUserPosts(username: string, skip: number): Promise<PostWithID[] | undefined> {
    const posts = await PostModel.find({ username }).select('-__v').skip(skip).limit(20).sort({ date: -1 }).exec()

    return posts ? posts.map((post) => post.toObject()) : undefined
  }

  async findAllPostComments(commentsID: string[], skip: number): Promise<PostWithID[] | undefined> {
    const posts = await PostModel.find({ _id: { $in: commentsID } }).sort({ date: -1 }).select('-__v').skip(skip).limit(20).exec()

    return posts ? posts.map((post) => post.toObject()) : undefined
  }

  async findUserReposts(id: string[]): Promise<repostValidation[] | undefined> {
    const posts = await PostModel.find({ _id: { $in: id } }).select('_id authorID originalPost').exec()

    return posts ? posts.map((post) => post.toObject()) : undefined
  }

  async findPostById(id: string): Promise<PostWithID | undefined> {
    const post = await PostModel.findById(id).select('-__v').exec()

    return post ? post.toObject() : undefined
  }

  async findAllPosts(skip: number): Promise<PostWithID[] | undefined> {
    const posts = await PostModel.find().select('-__v').skip(skip).limit(20).sort({ date: -1 }).exec()

    return posts ? posts.map((post) => post.toObject()) : undefined
  }

  async searchPosts(query: string): Promise<PostWithID[] | undefined> {
    const posts = await PostModel.find(
      { 
        content: { $regex: query, $options: 'i' } 
      }
    ).select('-__v').exec()

    return posts ? posts.map((post) => post.toObject()) : undefined
  }
}

export { PostRepositoryMongoose }
