import express from 'express'

const router = express.Router()

import {
  refreshToken,
  getBible,
  importBible,
} from '../controllers/index.js'

router.post('/refresh-token', refreshToken)
router.post('/import-bible', importBible)
router.get('/bible', getBible)

export default router