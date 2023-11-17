import mongoose from 'mongoose';
const deletedSongSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    body: {
        type: String,
        required: true,
        index: true
    },
    lastModified: {
        type: String,
        required: true,
        index: true
    }
});
const DeletedSong = mongoose.model('deleted-song', deletedSongSchema);
export default DeletedSong;
//# sourceMappingURL=DeletedSong.js.map