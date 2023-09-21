class Post {
  constructor(
    public authorID: string,
    public content: string,
    public date?: Date,
    public coments?: Post[],
    public likes?: string[],
    public reposts?: string[],
    public originalPost?: string,
    public media?: string[]
  ) {}
}

export default Post
