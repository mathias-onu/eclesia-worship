import mongoose from 'mongoose'
import ISong from '../interfaces/songModel.js'

const songSchema = new mongoose.Schema<ISong>({
  title: {
    type: String,
    required: true,
  },
  songText: {
    type: String,
    required: true
  },
  presentationText: [{
    type: String,
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const Song = mongoose.model('song', songSchema)

export default Song