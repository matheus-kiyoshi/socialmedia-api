class User {
  constructor(
    public username: string,
    public password: string,
    public followers?: User[],
    public following?: User[],
    public postsCount?: number,
    public nickname?: string,
    public bio?: string,
    public icon?: string
  ) {}
}

export default User
