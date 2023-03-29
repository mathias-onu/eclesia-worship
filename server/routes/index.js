import express from 'express'

const router = express.Router()

import {
  refreshToken,
  syncSongs,
  syncSongsPartial,
  getSong,
  getSongs,
  syncPlaylists,
  syncPlaylistsPartial,
  getPlaylist,
  getPlaylists,
  getBible
} from '../controllers/index.js'
import protect from '../middleware/authMiddleware.js'

router.post('/refresh-token', refreshToken)
router.post('/sync/songs', protect, syncSongs)
router.post('/sync-partial/songs', protect, syncSongsPartial)
router.get('/songs', protect, getSongs)
router.get('/songs/:id', protect, getSong)

router.post('/sync/playlists', protect, syncPlaylists)
router.post('/sync-partial/playlists', protect, syncPlaylistsPartial)
router.get('/playlists', protect, getPlaylists)
router.get('/playlists/:id', protect, getPlaylist)

router.get('/bible', getBible)

export default router