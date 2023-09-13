import mongoose from 'mongoose'
import { PublicUser, PublicUserCard, UserRepository, UserWithID } from './UserRepository'
import User from '../entities/User'

const UserModel = mongoose.model('User', new mongoose.Schema({
  _id: {
    type: String,
    default: new mongoose.Types.ObjectId().toString()
  },
  username: String,
  password: String,
  nickname: String,
  bio: String,
  icon: String,
  followers: {
    type: Array,
    ref: 'User'
  },
  following: {
    type: Array,
    ref: 'User'
  },
  postsCount: Number,
  usersBlocked: {
    type: Array,
    ref: 'User'
  }
}))

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

  async updateProfile(user: UserWithID): Promise<PublicUser | undefined> {
    const userModel = await UserModel.findByIdAndUpdate(
      user._id,
      { 
        $set: {
          icon: user.icon,
          bio: user.bio,
          nickname: user.nickname 
        }
      },
      { new: true }
    ).select('-password -__v -_id')

    return userModel ? userModel.toObject() : undefined
  }

  async updateUserFollows(user: UserWithID, user2: UserWithID): Promise<string> {
    const userModel = await UserModel.findByIdAndUpdate(
      user._id,
      { $push: { following: user2._id } },
      { new: true }
    )

    const userModel2 = await UserModel.findByIdAndUpdate(
      user2._id,
      { $push: { followers: user._id } },
      { new: true }
    )

    return 'Followed'
  }

  async unfollowUser(user: UserWithID, user2: UserWithID): Promise<string> {
    const userModel = await UserModel.findByIdAndUpdate(
      user._id,
      { $pull: { following: user2._id } },
      { new: true }
    )
    const userModel2 = await UserModel.findByIdAndUpdate(
      user2._id,
      { $pull: { followers: user._id } },
      { new: true }
    )
    
    return 'Unfollowed'
  }

  async updateUserBlocks(user: UserWithID, user2: UserWithID): Promise<string> {
    const userModel = await UserModel.findByIdAndUpdate(
      user._id,
      { $push: { usersBlocked: user2._id } },
      { new: true }
    )

    return 'Blocked'
  }

  async findByUsername(username: string): Promise<UserWithID | undefined> {
    const userModel = await UserModel.findOne({ username: username }).exec()

    return userModel ? userModel.toObject() : undefined
  }

  async findUser(username: string): Promise<PublicUser | undefined> {
    const userModel = await UserModel.findOne({ username: username }).select('-password -__v -_id').exec()

    return userModel ? userModel.toObject() : undefined
  }

  async findById(id: string): Promise<UserWithID | undefined> {
    const userModel = await UserModel.findById(id).select('-password -__v').exec()

    return userModel ? userModel.toObject() : undefined
  }

  async findAllFollowers(username: string, skip: number): Promise<PublicUserCard[] | undefined> {
    const userModel = await UserModel.findOne({ username: username }).select('followers').exec()

    if (!userModel) {
      return
    }
    const followers: PublicUserCard[] = await UserModel.find({ _id: { $in: userModel.followers } }).select('-_id username nickname icon bio').skip(skip).limit(20).exec()

    return followers
  }
}

export { UserRepositoryMongoose }