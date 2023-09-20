import { NextFunction, Request, Response } from 'express'
import 'dotenv/config'
import jwt, { JwtPayload } from 'jsonwebtoken'

function checkToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401).json({ message: 'Access denied' })
  }

  try {
    const secret = process.env.SECRET || ''
    const { id, username } = jwt.verify(token, secret) as JwtPayload

    const user = { id: id, username: username }

    if (!user) {
      return res.sendStatus(401).json({ message: 'Access denied' })
    }

    req.user = user

    next()
  } catch (error) {
    return res.sendStatus(400).json({ message: 'Token invalid' })
  }
}

export default checkToken