class User {
  constructor(
    public username: string,
    public password: string,
    public nickname?: string,
    public icon?: string
  ) {}
}

export default User
