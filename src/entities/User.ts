class User {
  constructor(
    public username: string,
    public password: string,
    public followers?: string[],
    public following?: string[],
    public postsCount?: number,
    public nickname?: string,
    public bio?: string,
    public usersBlocked?: string[],
    public posts?: string[],
    public reposts?: string[],
    public icon?: string,
    public banner?: string
  ) {}
}

export default User
