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

export interface repostValidation {
  _id: string
  authorID: string
  originalPost: string
}

interface PostRepository {
  createPost(post: Post): Promise<PostWithID | undefined>
  updatePost(post: EditPost): Promise<PostWithID | undefined>
  deletePost(id: string): Promise<string>
  likePost(postID: string, userID: string): Promise<string>
  unlikePost(postID: string, userID: string): Promise<string>
  rePost(post: Post, postID: string): Promise<PostWithID | undefined>
  createComment(post: Post): Promise<PostWithID | undefined>
  addCommentToPost(postID: string, commentID: string): Promise<string>
  findAllPostComments(commentsID: string[], skip: number): Promise<PostWithID[] | undefined>
  findUserReposts(id: string[]): Promise<repostValidation[] | undefined>
  findPostById(id: string): Promise<PostWithID | undefined>
  findAllPosts(skip: number): Promise<PostWithID[] | undefined>
}

export { PostRepository }
