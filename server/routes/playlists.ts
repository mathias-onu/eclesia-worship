import express from 'express'

const router = express.Router()

import {
  syncPlaylists,
  syncPlaylistsPartial,
  getPlaylist,
  getPlaylists,
} from '../controllers/playlists.js'

import { protectDropbox } from '../middleware/authMiddleware.js'

router.post('/sync/playlists', protectDropbox, syncPlaylists)
router.post('/sync-partial/playlists', protectDropbox, syncPlaylistsPartial)
router.get('/playlists', protectDropbox, getPlaylists)
router.get('/playlists/:id', protectDropbox, getPlaylist)

export default router