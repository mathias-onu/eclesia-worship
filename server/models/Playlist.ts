import mongoose from "mongoose"
import IPlaylist from "../interfaces/playlistModel"

const playlistSchema = new mongoose.Schema<IPlaylist>({
  title: {
    type: String,
    required: true,
    index: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  songs: [{
    id: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true 
    },
    title: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: true
    }
  }]
})

const Playlist = mongoose.model('playlist', playlistSchema)

export default Playlist