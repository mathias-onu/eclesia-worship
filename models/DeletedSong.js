import mongoose from 'mongoose'

const deletedSongSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  lastModified: {
    type: String,
    required: true
  }
})

const DeletedSong = mongoose.model('deleted-song', deletedSongSchema)

export default DeletedSong