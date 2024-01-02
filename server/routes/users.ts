import express from 'express'

const router = express.Router()

import {
    getProfile,
    login,
    signup,
    updateProfile,
    deleteProfile,
    forgotPassword,
    resetPassword
} from '../controllers/users.js'

import protect, { isAdmin } from '../middleware/authMiddleware.js'

router.post('/signup', protect, isAdmin, signup)
router.post('/login', login)
router.route('/profile').get(protect, getProfile).put(protect, updateProfile).delete(protect, deleteProfile)
router.post('/forgot-password', protect, forgotPassword)
router.post('/reset-password/:token', protect, resetPassword)

export default router