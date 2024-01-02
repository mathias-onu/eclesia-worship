import express from 'express'

const router = express.Router()

import {
  syncSongs,
  getSong,
  getSongs,
  syncSongsPartial
} from '../controllers/songs.js'

import { protectDropbox } from '../middleware/authMiddleware.js'

router.post('/sync/songs', protectDropbox, syncSongs)
router.post('/sync-partial/songs', protectDropbox, syncSongsPartial)
router.get('/songs', protectDropbox, getSongs)
router.get('/songs/:id', protectDropbox, getSong)

export default router