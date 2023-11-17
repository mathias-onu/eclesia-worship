import mongoose from 'mongoose';
const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    lastModified: {
        type: String,
        required: true,
    }
});
const Song = mongoose.model('song', songSchema);
Song.createIndexes({ _id: 1, title: 1, body: 1, lastModified: 1 });
export default Song;
//# sourceMappingURL=Song.js.map