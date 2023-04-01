import mongoose from "mongoose"

const playlistSchema = mongoose.Schema({
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

Playlist.createIndexes({ _id: 1, title: 1, songs: 1, lastModified: 1 })

export default Playlist