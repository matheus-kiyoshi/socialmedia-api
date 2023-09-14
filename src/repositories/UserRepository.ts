import User from '../entities/User'

export interface UserWithID extends User {
  _id: string
}

export interface PublicUser {
  nickname: string
  username: string
  icon: string
  bio: string
  followers?: number
  following?: number
  postsCount?: number
}

export interface PublicUserCard {
  username?: string
  nickname?: string
  icon?: string
  bio?: string
  isBlocked?: boolean
}

interface UserRepository {
  create(user: User): Promise<unknown>
  updatePassword(user: UserWithID): Promise<UserWithID | undefined>
  deleteUser(id: string): Promise<unknown>
  updateProfile(user: UserWithID): Promise<PublicUser | undefined>
  updateUserFollows(user: UserWithID, user2: UserWithID): Promise<string>
  unfollowUser(user: UserWithID, user2: UserWithID): Promise<string>
  updateUserBlocks(user: UserWithID, user2: UserWithID): Promise<string>
  unblockUser(user: UserWithID, user2: UserWithID): Promise<string>
  findByUsername(username: string): Promise<UserWithID | undefined>
  findUser(username: string): Promise<PublicUser | undefined>
  findById(id: string): Promise<UserWithID | undefined>
  findBlockedUsers(username: string, skip: number): Promise<PublicUserCard[] | undefined>
  findAllFollowers(username: string, skip: number): Promise<PublicUserCard[] | undefined>
}

export { UserRepository }