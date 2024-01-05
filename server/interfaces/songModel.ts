import mongoose from "mongoose"

export default interface ISong extends mongoose.Document {
    title: string,
    songText: string,
    presentationText: string[],
    createdAt: Date,
    createdBy: mongoose.Schema.Types.ObjectId,
}