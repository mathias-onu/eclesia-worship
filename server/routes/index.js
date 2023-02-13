import express from 'express'

const router = express.Router()

import { authUser, refreshToken, syncSongs, getSong, getSongs, syncPlaylists, getPlaylist, getPlaylists, dummy } from '../controllers/index.js'
import protect from '../middleware/authMiddleware.js'

router.get('/auth', authUser)
router.post('/refresh-token', refreshToken)
router.post('/sync/songs', protect, syncSongs)
router.get('/songs', protect, getSongs)
router.get('/songs/:id', protect, getSong)

router.get('/sync/playlists', protect, syncPlaylists)
router.get('/playlists', protect, getPlaylists)
router.get('/playlists/:id', protect, getPlaylist)

router.get('/dummy', dummy)

export default router