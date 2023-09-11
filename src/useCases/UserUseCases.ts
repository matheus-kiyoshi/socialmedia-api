import { HttpException } from '../interfaces/HttpException'
import { UserRepository } from '../repositories/UserRepository'
import User from '../entities/User'
import * as fs from 'fs'
import * as mime from 'mime'
import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { resolve } from 'path'


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

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    user.nickname = user.username
    const defaultIcon = resolve(__dirname, '../../public/default-icon.jpg')
    user.icon = await this.imageToBase64(defaultIcon)

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

    // const user = await this.userRepository.findByEmail(email)
    // if (!user) {
    //   throw new HttpException('User not found', 404)
    // }

    // verify password
    // const passwordMatch = await bcrypt.compare(password, user.password)
    // if (!passwordMatch) {
    //   throw new HttpException('Invalid password', 422)
    // }

    // try {
    //   const secret =
    //     process.env.SECRET ||
    //     'DA312D3124WAOIB521UDVPONA52152DGPWAB521DYNVWAD412WO44123217659AVBH'
    //   const token = jwt.sign(
    //     {
    //       id: user._id
    //     },
    //     secret,
    //     {
    //       expiresIn: '1d'
    //     }
    //   )

    //   return { msg: 'Login successful', token: token, id: user._id }
    // } catch (error) {
    //   throw new HttpException('Internal server error', 500)
    // }
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
