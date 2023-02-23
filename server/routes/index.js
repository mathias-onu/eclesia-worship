import express from 'express'

const router = express.Router()

import {
  refreshToken,
  syncSongs,
  getSong,
  getSongs,
  syncPlaylists,
  getPlaylist,
  getPlaylists
} from '../controllers/index.js'
import protect from '../middleware/authMiddleware.js'

router.post('/refresh-token', refreshToken)
router.post('/sync/songs', protect, syncSongs)
router.get('/songs', protect, getSongs)
router.get('/songs/:id', protect, getSong)

router.post('/sync/playlists', protect, syncPlaylists)
router.get('/playlists', protect, getPlaylists)
router.get('/playlists/:id', protect, getPlaylist)

export default router