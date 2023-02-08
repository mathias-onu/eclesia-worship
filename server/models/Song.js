import mongoose from 'mongoose'

const songSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
})

const Song = mongoose.model('song', songSchema)

export default Song