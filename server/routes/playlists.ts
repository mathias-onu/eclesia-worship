import express from 'express'

const router = express.Router()

import {
  addSongToPlaylist,
  changeSongsPositions,
  deletePlaylist,
  editPlaylist,
  getPlaylist,
  getPlaylists,
  newPlaylist,
  removeSongFromPlaylist,
} from '../controllers/playlists.js'

import protect from '../middleware/authMiddleware.js'

router.post('/playlists/new', protect, newPlaylist)
router.get('/playlists', protect, getPlaylists)
router.patch('/playlists/add/:playlistId/:songId', protect, addSongToPlaylist)
router.delete('/playlists/remove/:playlistId/:songId', protect, removeSongFromPlaylist)
router.route('/playlists/:id').get(protect, getPlaylist).delete(protect, deletePlaylist).patch(protect, editPlaylist)
router.patch('/playlists/change-songs-positions/:id', protect, changeSongsPositions)

export default router