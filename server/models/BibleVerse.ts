import mongoose from 'mongoose'

const verseSchema = new mongoose.Schema({
    book: {
        type: String,
        required: true
    },
    chapter: {
        type: Number,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})

const Verse = mongoose.model('bible-verse', verseSchema)

export default Verse