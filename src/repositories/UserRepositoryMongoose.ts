import mongoose from 'mongoose'
import { PublicUser, UserRepository, UserWithID } from './UserRepository'
import User from '../entities/User'

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: new mongoose.Types.ObjectId().toString()
  },
  nickname: String,
  username: String,
  password: String,
  followers: Number,
  following: Number,
  postsCount: Number,
  icon: String
})

const UserModel = mongoose.model('User', userSchema)

class UserRepositoryMongoose implements UserRepository {
  async create(user: User): Promise<unknown> {
    const userModel = new UserModel(user)

    await userModel.save()

    return userModel
  }

  async updatePassword(user: UserWithID): Promise<UserWithID | undefined> {
    const userModel = await UserModel.findByIdAndUpdate(
      user._id,
      { password: user.password },
      { new: true }
    )

    return userModel ? userModel.toObject() : undefined
  }
  
  async deleteUser(id: string): Promise<unknown> {
    const userModel = await UserModel.findByIdAndDelete(id)

    return userModel ? userModel.toObject() : undefined
  }

  async findByUsername(username: string): Promise<UserWithID | undefined> {
    const userModel = await UserModel.findOne({ username: username }).exec()

    return userModel ? userModel.toObject() : undefined
  }

  async findUser(username: string): Promise<PublicUser | undefined> {
    const userModel = await UserModel.findOne({ username: username }).select('-password -__v -_id').exec()

    return userModel ? userModel.toObject() : undefined
  }
}

export { UserRepositoryMongoose }