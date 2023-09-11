import mongoose from 'mongoose'
import { UserRepository } from './UserRepository'
import User from '../entities/User'

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: new mongoose.Types.ObjectId().toString()
  },
  nickname: String,
  username: String,
  password: String,
  icon: String
})

const UserModel = mongoose.model('User', userSchema)

class UserRepositoryMongoose implements UserRepository {
  async create(user: User): Promise<unknown> {
    const userModel = new UserModel(user)

    await userModel.save()

    return userModel
  }
}

export { UserRepositoryMongoose }