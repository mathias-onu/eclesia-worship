import mongoose from "mongoose"

const playlistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  songs: {
    type: String,
    required: true
  }
})

const Playlist = mongoose.model('playlist', playlistSchema)

export default Playlist