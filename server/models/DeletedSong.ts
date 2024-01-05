import mongoose from 'mongoose'
import IDeletedSong from '../interfaces/deletedSongModel.js'

const deletedSongSchema = new mongoose.Schema<IDeletedSong>({
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
  },
  deletedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const DeletedSong = mongoose.model('deleted-song', deletedSongSchema)

export default DeletedSong