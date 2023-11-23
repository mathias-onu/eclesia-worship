import express from 'express'

const router = express.Router()

import {
  syncSongs,
  getSong,
  getSongs,
  syncSongsPartial
} from '../controllers/songs.js'

import protect from '../middleware/authMiddleware.js'

router.post('/sync/songs', protect, syncSongs)
router.post('/sync-partial/songs', protect, syncSongsPartial)
router.get('/songs', protect, getSongs)
router.get('/songs/:title', protect, getSong)

export default router