import express from 'express'

const router = express.Router()

import {
  refreshToken,
  getBible
} from '../controllers/index.js'

router.post('/refresh-token', refreshToken)
router.get('/bible', getBible)

export default router