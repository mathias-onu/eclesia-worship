import mongoose from "mongoose"

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  songs: {
    type: String,
    required: true,
    index: true
  },
  lastModified: {
    type: String,
    required: true,
    index: true
  }
})

const Playlist = mongoose.model('playlist', playlistSchema)

export default Playlist