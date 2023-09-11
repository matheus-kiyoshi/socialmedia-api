import User from '../entities/User'

interface UserRepository {
  create(user: User): Promise<unknown>
}

export { UserRepository }