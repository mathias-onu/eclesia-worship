import express from 'express'

const router = express.Router()

import {
  getSong,
  getSongs,
  addSong,
  editSong,
  deleteSong
} from '../controllers/songs.js'
import protect from '../middleware/authMiddleware.js'

router.post('/songs/new', protect, addSong)
router.get('/songs', protect, getSongs)
router.route('/songs/:id').get(protect, getSong).patch(protect, editSong).delete(protect, deleteSong)

export default router