import Post from '../entities/Post'

export interface PostWithID extends Post {
  _id: string
}

export interface EditPost {
  id: string
  authorID: string
  content: string
  media: string[]
}

interface PostRepository {
  createPost(post: Post): Promise<unknown>
  updatePost(post: EditPost): Promise<PostWithID | undefined>
  findPostById(id: string): Promise<PostWithID | undefined>
  findAllPosts(skip: number): Promise<PostWithID[] | undefined>
}

export { PostRepository }
