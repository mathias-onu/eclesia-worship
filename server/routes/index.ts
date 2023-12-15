import express from 'express'

const router = express.Router()

import {
  refreshToken,
  getBible,
  getLocalBible,
} from '../controllers/index.js'

router.post('/refresh-token', refreshToken)
router.get('/local-bible', getLocalBible)
router.get('/bible', getBible)

export default router