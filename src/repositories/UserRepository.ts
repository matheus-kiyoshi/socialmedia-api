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
  posts?: string[]
  reposts?: string[]
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
  addPostToUser(userID: string, postID: string): Promise<string>
  addRepostToUser(userID: string, postID: string): Promise<string>
  findByUsername(username: string): Promise<UserWithID | undefined>
  searchUsers(query: string): Promise<PublicUserCard[] | undefined>
  findUser(username: string): Promise<PublicUser | undefined>
  findById(id: string): Promise<UserWithID | undefined>
  findBlockedUsers(username: string, skip: number): Promise<PublicUserCard[] | undefined>
  findAllFollowers(username: string, skip: number): Promise<PublicUserCard[] | undefined>
  findAllFollowing(username: string, skip: number): Promise<PublicUserCard[] | undefined>
  findAll(): Promise<UserWithID[] | undefined>
  addNotification(userID: string, type: string, notID: string): Promise<string>
}

export { UserRepository }
