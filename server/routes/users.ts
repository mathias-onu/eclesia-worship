import express from 'express'

const router = express.Router()

import {
    getProfile,
    login,
    signup,
    updateProfile,
    deleteProfile
} from '../controllers/users.js'

import protect from '../middleware/authMiddleware.js'

router.post('/signup', signup)
router.post('/login', login)
router.route('/profile').get(protect, getProfile).put(protect, updateProfile).delete(protect, deleteProfile)


export default router