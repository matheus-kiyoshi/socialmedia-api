import mongoose from 'mongoose'
import { UserRepository } from './UserRepository'
import User from '../entities/User'

interface UserWithID extends User {
  _id: string
}

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

  async findByUsername(username: string): Promise<UserWithID | undefined> {
    const userModel = await UserModel.findOne({ username: username }).exec()

    return userModel ? userModel.toObject() : undefined
  }
}

export { UserRepositoryMongoose }