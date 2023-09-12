import User from '../entities/User'

interface UserWithID extends User {
  _id: string
}

interface UserRepository {
  create(user: User): Promise<unknown>
  findByUsername(username: string): Promise<UserWithID | undefined>
}

export { UserRepository }