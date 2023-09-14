import Post from '../entities/Post'

interface PostRepository {
  createPost(post: Post): Promise<unknown>
}

export { PostRepository }
