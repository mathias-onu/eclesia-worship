import mongoose from "mongoose"

export default interface IDeletedSong extends mongoose.Document {
    title: string,
    songText: string,
    presentationText: string[],
    createdAt: Date,
    createdBy: mongoose.Schema.Types.ObjectId,
    deletedAt: Date,
    deletedBy: mongoose.Schema.Types.ObjectId
}