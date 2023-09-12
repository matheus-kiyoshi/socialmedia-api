import { NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401).json({ message: 'Access denied' })
  }

  try {
    const secret =
      process.env.SECRET ||
      'DA312D3124WAOIB521UDVPONA52152DGPWAB521DYNVWAD412WO44123217659AVBH'

    jwt.verify(token, secret)
    next()
  } catch (error) {
    return res.sendStatus(400).json({ message: 'Token invalid' })
  }
}

export default checkToken