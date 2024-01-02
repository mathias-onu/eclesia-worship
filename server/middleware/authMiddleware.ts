import asyncHandler from "express-async-handler"
import { Dropbox } from "dropbox"
import { Request, Response, NextFunction } from "express"
import IUserRequest from "../interfaces/userRequest.js"
import jwt, { JwtPayload, DecodeOptions } from 'jsonwebtoken'
import User from "../models/User.js"

export const protectDropbox = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authorization: string | undefined = req.headers.authorization

  if (authorization && authorization.startsWith('Bearer')) {
    try {
      const token: string = authorization.split(' ')[1]
      const dbx: Dropbox = new Dropbox({ accessToken: token })
      const response = await dbx.filesListFolder({ path: '/SongBook/Română/' })
      if (response && response.status === 200) {
        next()
      } else {
        res.status(401)
        throw new Error('Authorization failed')
      }
    } catch (error) {
      res.status(401)
      throw new Error('Token failed')
    }
  } else {
    res.status(401)
    throw new Error('No token')
  }
})

const protect = asyncHandler(async (req: IUserRequest, res: Response, next: NextFunction) => {
  const authorization: string | undefined = req.headers.authorization

  if (authorization && authorization.startsWith('Bearer')) {
    try {
      const token: string = authorization.split(' ')[1]
      const decoded: string | JwtPayload = jwt.decode(token, process.env.JWT_SECRET as DecodeOptions) as JwtPayload
      const user = await User.findById(decoded.userId)

      req.userId = user.id
      next()
    } catch (error) {
      res.status(401)
      throw new Error('Token failed')
    }
  } else {
    res.status(401)
    throw new Error('No token')
  }
})

export default protect