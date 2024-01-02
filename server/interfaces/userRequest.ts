import  { Request } from 'express'

interface IUserRequest extends Request {
    userId: string
}

export default IUserRequest