import User from '../entities/User'

export interface UserWithID extends User {
  _id: string
}

export interface PublicUser {
  nickname: string
  username: string
  icon: string
  followers: number
  following: number
  postsCount: number
}

interface UserRepository {
  create(user: User): Promise<unknown>
  updatePassword(user: UserWithID): Promise<UserWithID | undefined>
  deleteUser(id: string): Promise<unknown>
  updateProfile(user: UserWithID): Promise<PublicUser | undefined>
  findByUsername(username: string): Promise<UserWithID | undefined>
  findUser(username: string): Promise<PublicUser | undefined>
}

export { UserRepository }