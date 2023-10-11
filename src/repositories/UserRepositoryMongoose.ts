import mongoose from 'mongoose'
import { PublicUser, PublicUserCard, UserRepository, UserWithID } from './UserRepository'
import User from '../entities/User'

const UserModel = mongoose.model('User', new mongoose.Schema({
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
  posts: {
    type: Array,
    ref: 'Post'
  },
  reposts: {
    type: Array,
    ref: 'Post'
  },
  postsCount: Number,
  usersBlocked: {
    type: Array,
    ref: 'User'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  notifications: Array  
  },
  { autoIndex: false }
))

class UserRepositoryMongoose implements UserRepository {
  async create(user: User): Promise<unknown> {
    const userModel = new UserModel(user)
    console.log(userModel)
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

  async unblockUser(user: UserWithID, user2: UserWithID): Promise<string> {
    const userModel = await UserModel.findByIdAndUpdate(
      user._id,
      { $pull: { usersBlocked: user2._id } },
      { new: true }
    )
    const userModel2 = await UserModel.findByIdAndUpdate(
      user2._id,
      { $pull: { usersBlocked: user._id } },
      { new: true }
    )

    return 'Unblocked'
  }

  async addPostToUser(userID: string, postID: string): Promise<string> {
    const userModel = await UserModel.findByIdAndUpdate(
      userID,
      { 
        $push: { posts: postID }, 
        $inc: { postsCount: 1 } 
      },
      { new: true }
    )

    return 'Post added'
  }

  async addRepostToUser(userID: string, postID: string): Promise<string> {
    const userModel = await UserModel.findByIdAndUpdate(
      userID,
      { 
        $push: { reposts: postID }, 
        $inc: { postsCount: 1 } 
      },
      { new: true }
    )

    return 'Repost added'
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

  async findBlockedUsers(username: string, skip: number): Promise<PublicUserCard[] | undefined> {
    const userModel = await UserModel.findOne({ username: username }).select('usersBlocked').exec()
    if (!userModel) {
      return
    }
    
    const usersBlocked: PublicUserCard[] = await UserModel.find({ _id: { $in: userModel.usersBlocked } }).select('-_id username nickname icon bio').skip(skip).exec()
    return usersBlocked
  }

  async findAllFollowers(username: string, skip: number): Promise<PublicUserCard[] | undefined> {
    const userModel = await UserModel.findOne({ username: username }).select('followers').exec()
    if (!userModel) {
      return
    }

    const followers: PublicUserCard[] = await UserModel.find({ _id: { $in: userModel.followers } }).select('-_id username nickname icon bio isBlocked').skip(skip).limit(20).exec()
    return followers
  }

  async findAllFollowing(username: string, skip: number): Promise<PublicUserCard[] | undefined> {
    const userModel = await UserModel.findOne({ username: username }).select('following').exec()
    if (!userModel) {
      return
    }

    const following: PublicUserCard[] = await UserModel.find({ _id: { $in: userModel.following } }).select('-_id username nickname icon bio isBlocked').skip(skip).limit(20).exec()
    return following
  }

  async findAll(): Promise<UserWithID[] | undefined> {
    const userModel = await UserModel.find().select('-password -__v').exec()
    return userModel ? userModel.map(user => user.toObject()) : undefined
  }

  async searchUsers(query: string): Promise<PublicUserCard[] | undefined> {
    const userModel = await UserModel.find(
      { 
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { nickname: { $regex: query, $options: 'i' } },
          { bio: { $regex: query, $options: 'i' } }
        ]
      }
    ).select('username nickname icon bio isBlocked').exec()

    return userModel ? userModel.map(user => user.toObject()) : undefined
  }

  async addNotification(userID: string, type: string, notID: string): Promise<string> {
    const userModel = await UserModel.findByIdAndUpdate(
      userID,
      { $push: { notifications: [type, notID, new Date()] } },
      { new: true }
    )

    return 'Notification added'
  }

  async removePostFromUser(userID: string, postID: string): Promise<string> {
    try {
      const objectId = new mongoose.Types.ObjectId(postID);
      const userModel = await UserModel.findByIdAndUpdate(
        userID,
        { $pull: { posts: objectId } },
        { new: true }
      );
  
      if (!userModel) {
        return 'User not found';
      }
  
      return 'Post removed';
    } catch (error) {
      return 'Error removing post';
    }
  }

  async removeRepostFromUser(userID: string, postID: string): Promise<string> {
    try {
      const objectId = new mongoose.Types.ObjectId(postID)
      const userModel = await UserModel.findByIdAndUpdate(
        userID,
        { $pull: { reposts: postID } },
        { new: true }
      )
  
      if (!userModel) {
        return 'User not found';
      }

      return 'Repost removed'
    } catch (error) {
      return 'Error removing repost'
    }
  }

  async findFollower(id: string, userID: string): Promise<UserWithID | undefined> {
    const userModel = await UserModel.findById(userID).select('followers').exec()

    const follower = userModel?.followers.find(follower => follower.toString() === id)

    return follower ? follower : undefined
  }
}

export { UserRepositoryMongoose }
