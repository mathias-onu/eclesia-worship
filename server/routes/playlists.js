import express from 'express'

const router = express.Router()

import {
  syncPlaylists,
  syncPlaylistsPartial,
  getPlaylist,
  getPlaylists,
} from '../controllers/playlists.js'

import protect from '../middleware/authMiddleware.js'

router.post('/sync/playlists', protect, syncPlaylists)
router.post('/sync-partial/playlists', protect, syncPlaylistsPartial)
router.get('/playlists', protect, getPlaylists)
router.get('/playlists/:id', protect, getPlaylist)

export default router