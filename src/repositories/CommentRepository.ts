import Post from '../entities/Post'

export interface PostWithID extends Post {
	_id: string
}

interface CommentRepository {
	createComment(post: Post): Promise<PostWithID | undefined>
	findAllPostComments(postComments: string[], skip: number): Promise<PostWithID[] | undefined>
}

export { CommentRepository }

