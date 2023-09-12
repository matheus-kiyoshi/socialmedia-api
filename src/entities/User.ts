class User {
  constructor(
    public username: string,
    public password: string,
    public followers?: number,
    public following?: number,
    public postsCount?: number,
    public nickname?: string,
    public icon?: string
  ) {}
}

export default User
