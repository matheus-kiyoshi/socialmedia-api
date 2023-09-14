import { HttpException } from '../interfaces/HttpException'
import { UserRepository } from '../repositories/UserRepository'
import User from '../entities/User'
import * as fs from 'fs'
import * as mime from 'mime'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { resolve } from 'path'
import nodemailer from 'nodemailer'

class UserUseCases {
  constructor(private userRepository: UserRepository) {}

  async create(user: User) {
    if (!user.username) {
      throw new HttpException('Username is required', 400)
    }
    if (!user.password) {
      throw new HttpException('Password is required', 400)
    }
    if (user.password.length < 8) {
      throw new HttpException('Password must be at least 8 characters', 400)
    }

    // verify if user already exists
    user.username = user.username.toLowerCase()
    const userExists = await this.userRepository.findByUsername(user.username)
    if (userExists) {
      throw new HttpException('User already exists', 409)
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    // default attributes
    user.nickname = user.username
    user.following = []
    user.followers = []
    user.postsCount = 0    
    user.bio = ''
    user.usersBlocked = []
    
    const defaultIcon = resolve(__dirname, '../../public/default-icon.jpg')
    user.icon = this.imageToBase64(defaultIcon)

    const result = await this.userRepository.create(user)
    return result
  }

  async login(username: string, password: string) {
    if (!username) {
      throw new HttpException('Email is required', 400)
    }
    if (!password) {
      throw new HttpException('Password is required', 400)
    }

    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    // verify password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new HttpException('Invalid password', 422)
    }

    try {
      const secret =
        process.env.SECRET ||
        'DA312D3124WAOIB521UDVPONA52152DGPWAB521DYNVWAD412WO44123217659AVBH'
      const token = jwt.sign(
        {
          id: user._id
        },
        secret,
        {
          expiresIn: '1d'
        }
      )

      return { msg: 'Login successful', token: token, id: user._id }
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }

  async updatePassword(
    username: string,
    currentPassword: string,
    newPassword: string
  ) {
    if (!username) {
      throw new HttpException('Username is required', 400)
    }
    if (!currentPassword) {
      throw new HttpException('Password is required', 400)
    }
    if (!newPassword) {
      throw new HttpException('New password is required', 400)
    }
    if (newPassword.length < 8) {
      throw new HttpException('New password must be at least 8 characters', 400)
    }
    let user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    // verify password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passwordMatch) {
      throw new HttpException('Invalid password', 422)
    }

    const salt = await bcrypt.genSalt(10)
    newPassword = await bcrypt.hash(newPassword, salt)

    user = { ...user, password: newPassword }

    const result = await this.userRepository.updatePassword(user)
    return result
  }

  async deleteUser(username: string, password: string) {
    if (!username) {
      throw new HttpException('Username is required', 400)
    }
    if (!password) {
      throw new HttpException('Password is required', 400)
    }

    // verify if user exists
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    // verify password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      throw new HttpException('Invalid password', 422)
    }

    await this.userRepository.deleteUser(user._id)
    return { msg: 'User deleted' }
  }

  async updateProfile(username: string, nickname: string, bio: string,  icon?: string) {
    if (!username) {
      throw new HttpException('Username is required', 400)
    }
    if (!nickname) {
      throw new HttpException('Nickname is required', 400)
    }
    
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    user.nickname = nickname
    user.bio = bio
    if (icon) {
      user.icon = this.imageToBase64(resolve(__dirname, `../tmp/uploads/${icon}`))
    }

    const updateProfile = await this.userRepository.updateProfile(user)
    return updateProfile
  }

  async followUser(username: string, userToFollow: string) {
    if (!username) {
      throw new HttpException('Username is required', 400) 
    }
    if (!userToFollow) {
      throw new HttpException('User to follow is required', 400) 
    }
    if (username === userToFollow) {
      throw new HttpException('You cannot follow yourself', 400) 
    }

    // verify if user exists
    let user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    let userFollow = await this.userRepository.findByUsername(userToFollow)
    if (!userFollow) {
      throw new HttpException('User not found', 404)
    }

    if (user.usersBlocked?.includes(userFollow._id)) {
      throw new HttpException('You cannot follow blocked users', 400)
    }

    if (userFollow.usersBlocked?.includes(user._id)) {
      throw new HttpException('The user blocked you', 400)
    }

    // verify if user is already following
    if (user.following?.includes(userFollow._id)) {
      throw new HttpException('User is already following', 409)
    }

    const result = await this.userRepository.updateUserFollows(user, userFollow)
    return result
  }

  async unfollowUser(username: string, userToUnfollow: string) {
    if (!username) {
      throw new HttpException('Username is required', 400) 
    }
    if (!userToUnfollow) {
      throw new HttpException('User to unfollow is required', 400) 
    }
    if (username === userToUnfollow) {
      throw new HttpException('You cannot unfollow yourself', 400) 
    }

    // verify if user exists
    let user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    let userUnfollow = await this.userRepository.findByUsername(userToUnfollow)
    if (!userUnfollow) {
      throw new HttpException('User not found', 404)
    }

    // verify if user is already unfollowed
    if (!user.following?.includes(userUnfollow._id)) {
      throw new HttpException('You are not following this user', 409)
    }

    const result = await this.userRepository.unfollowUser(user, userUnfollow)
    return result
  }

  async blockUser(username: string, userToBlock: string) {
    if (!username) {
      throw new HttpException('Username is required', 400) 
    }
    if (!userToBlock) {
      throw new HttpException('User to block is required', 400) 
    }
    if (username === userToBlock) {
      throw new HttpException('You cannot block yourself', 400) 
    }

    // verify if user exists
    let user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    let userBlock = await this.userRepository.findByUsername(userToBlock)
    if (!userBlock) {
      throw new HttpException('User not found', 404)
    }

    // verify if user is already blocked
    if (user.usersBlocked?.includes(userBlock._id)) {
      throw new HttpException('User is already blocked', 409)
    }

    const result = await this.userRepository.updateUserBlocks(user, userBlock)
    return result
  }

  async unblockUser(username: string, userToUnblock: string) {
    if (!username) {
      throw new HttpException('Username is required', 400) 
    }
    if (!userToUnblock) {
      throw new HttpException('User to unblock is required', 400) 
    }
    if (username === userToUnblock) {
      throw new HttpException('You cannot unblock yourself', 400) 
    }

    // verify if user exists
    let user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new HttpException('User not found', 404)
    }

    let userUnblock = await this.userRepository.findByUsername(userToUnblock)
    if (!userUnblock) {
      throw new HttpException('User not found', 404)
    }

    // verify if user is already unblocked
    if (!user.usersBlocked?.includes(userUnblock._id)) {
      throw new HttpException('User is not blocked', 409)
    }

    const result = await this.userRepository.unblockUser(user, userUnblock)
    return result
  }

  async findBlockedUsers(username: string, skip: number) {
    if (!username) {
      throw new HttpException('Username is required', 404)
    }
    if (!skip) {
      skip = 0
    }

    const users = await this.userRepository.findBlockedUsers(username, skip)
    return users
  }

  async findByUsername(username: string) {
    if (!username) {
      throw new HttpException('Username is required', 404)
    }

    const user = await this.userRepository.findByUsername(username)
    return user
  }

  async findUser(username: string) {
    if (!username) {
      throw new HttpException('Username is required', 404)
    }

    const user = await this.userRepository.findUser(username)
    return user
  }

  async findById(id: string) {
    if (!id) {
      throw new HttpException('User id is required', 404)
    }

    const user = await this.userRepository.findById(id)
    return user
  }

  async findAllFollowers(username: string, user: string, skip?: number) {
    if (!username) {
      throw new HttpException('Username is required', 404)
    }
    if (!user) {
      throw new HttpException('User is required', 404)
    }
    if (!skip) {
      skip = 0
    }

    let users = await this.userRepository.findAllFollowers(username, skip)
    const blockedUsers = await this.userRepository.findBlockedUsers(user, 0)
    
    if (users && blockedUsers) {
      users.forEach(user => {
        if (blockedUsers.some(blockedUser => blockedUser.username === user.username)) {
          user.isBlocked = true
      }})
    }

    return users
  }

  async reportUser(username: string, userToReport: string, reason: string) {
    if (!username) {
      throw new HttpException('Username is required', 404)
    }
    if (!userToReport) {
      throw new HttpException('User to report is required', 404)
    }
    if (!reason) {
      throw new HttpException('Reason is required', 404)
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'Outlook',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECEIVER,
        subject: `Report user - ${username}`,
        text: reason,
      }
      
      return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error', error)
        } else {
          console.log('Email sent', info.response)
        }
      })
    } catch (error) {
      throw new HttpException('Internal server error', 500)
    }
  }

  imageToBase64(filePath: string): string {
    const imageData = fs.readFileSync(filePath)
    const mimeType = mime.getType(filePath)
  
    if (!mimeType) {
      throw new Error('Tipo MIME desconhecido para a extensão do arquivo.')
    }
  
    const base64Data = imageData.toString('base64')
  
    const base64String = `data:${mimeType};base64,${base64Data}`
  
    return base64String
  }
}

export { UserUseCases }
