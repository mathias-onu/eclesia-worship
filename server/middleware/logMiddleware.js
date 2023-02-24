import asyncHandler from 'express-async-handler'

const logMiddleware = asyncHandler(async (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const currentTime = new Date()
    console.log(req.originalUrl + ' responded with ' + res.statusCode + ' at ' + currentTime.toLocaleString())
  }

  next()
})

export default logMiddleware