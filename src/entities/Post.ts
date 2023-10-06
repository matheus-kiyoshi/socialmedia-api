class Post {
  constructor(
    public authorID: string,
    public username: string,
    public content: string,
    public date?: Date,
    public coments?: string[],
    public likes?: string[],
    public reposts?: string[],
    public originalPost?: string,
    public type?: 'post' | 'repost' | 'comment',
    public media?: string[]
  ) {}
}

export default Post
