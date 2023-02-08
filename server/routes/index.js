import express from 'express'

const router = express.Router()

import { authUser, refreshToken, syncSongs, getSong, getSongs } from '../controllers/index.js'
import protect from '../middleware/authMiddleware.js'

router.get('/auth', authUser)
router.post('/refresh-token', refreshToken)
router.post('/sync', protect, syncSongs)
router.get('/songs', protect, getSongs)
router.get('/songs/:id', protect, getSong)

export default router