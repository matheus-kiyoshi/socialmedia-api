class User {
  constructor(
    public username: string,
    public password: string,
    public followers?: string[],
    public following?: string[],
    public postsCount?: number,
    public nickname?: string,
    public bio?: string,
    public icon?: string
  ) {}
}

export default User
