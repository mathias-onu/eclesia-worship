import mongoose from "mongoose"

export default interface ISong extends mongoose.Document {
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
    ]
}