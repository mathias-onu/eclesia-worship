const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)

  if (process.env.NODE_ENV === 'development') {
    const currentTime = new Date()
    console.log(req.originalUrl + ' responded with ' + res.statusCode + ' at ' + currentTime.toLocaleString())
  }

  next(error)
}

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)

  if (process.env.NODE_ENV === 'development') {
    const currentTime = new Date()
    console.log(req.originalUrl + ' responded with ' + res.statusCode + ' at ' + currentTime.toLocaleString())
  }

  res.json({
    message: err.message,
    stack: err.stack,
  })
}

export { notFound, errorHandler }