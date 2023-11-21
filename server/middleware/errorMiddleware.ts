import { Request, Response, NextFunction } from "express"

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)

  if (process.env.NODE_ENV === 'development') {
    const currentTime = new Date()
    console.log(req.originalUrl + ' responded with ' + res.statusCode + ' at ' + currentTime.toLocaleString())
  }

  next(error)
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode: number = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)

  if (process.env.NODE_ENV === 'development') {
    const currentTime: Date = new Date()
    console.log(req.originalUrl + ' responded with ' + res.statusCode + ' at ' + currentTime.toLocaleString())
  }

  res.json({
    message: err.message,
    stack: err.stack,
  })
}

export { notFound, errorHandler }