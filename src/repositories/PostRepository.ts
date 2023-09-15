import Post from '../entities/Post'

export interface PostWithID extends Post {
  _id: string
}

interface PostRepository {
  createPost(post: Post): Promise<unknown>
  findPostById(id: string): Promise<PostWithID | undefined>
  findAllPosts(skip: number): Promise<PostWithID[] | undefined>
}

export { PostRepository }
