import mongoose from 'mongoose'
import 'dotenv/config'

export async function connect() {
  try {
    await mongoose.connect(process.env.DB_URL || '', { autoIndex: false })
    console.log('vasco')
  } catch (error) {
    console.log(error)
  }
}