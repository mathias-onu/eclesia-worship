import mongoose from "mongoose"

export default interface IDeletedSong extends mongoose.Document {
    title: string,
    worshipText: string,
    presentationText: string,
    createdAt: Date,
    createdBy: mongoose.Schema.Types.ObjectId,
    edits: [
        {
            user: mongoose.Schema.Types.ObjectId,
            date: Date
        }
    ],
    deletedAt: Date,
    deletedBy: mongoose.Schema.Types.ObjectId
}