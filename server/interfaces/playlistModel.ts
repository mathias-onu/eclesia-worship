import mongoose from "mongoose"

interface playlistSong {
    id: mongoose.Schema.Types.ObjectId,
    title: string,
    position: number
}

export default interface IPlaylist extends mongoose.Document {
    title: string,
    createdAt: Date,
    createdBy: mongoose.Schema.Types.ObjectId,
    songs: playlistSong[]
}