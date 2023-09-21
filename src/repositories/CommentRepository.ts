import Post from '../entities/Post'

export interface PostWithID extends Post {
	_id: string
}

interface CommentRepository {
	createComment(post: Post): Promise<PostWithID | undefined>
}

export { CommentRepository }

