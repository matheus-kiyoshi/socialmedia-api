class Post {
  constructor(
    public content: string,
    public images: string[],
    public authorId: string,
    public date: Date,
    public coments: Post[],
    public likes: number,
    public reposts: number
  ) {}
}

export default Post
