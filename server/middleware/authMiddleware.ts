import asyncHandler from "express-async-handler"
import { Dropbox } from "dropbox"
import { Request, Response, NextFunction } from "express"

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

export default protect