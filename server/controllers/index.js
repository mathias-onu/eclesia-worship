import asyncHandler from 'express-async-handler'
import fetch from 'node-fetch'
import Song from '../models/Song.js'
import Playlist from '../models/Playlist.js'
import DeletedSong from '../models/DeletedSong.js'

import { Dropbox } from 'dropbox';

export const refreshToken = asyncHandler(async (req, res) => {
  const response = await fetch("https://api.dropbox.com/oauth2/token", {
    body: `grant_type=refresh_token&refresh_token=${process.env.DROPBOX_REFRESH_TOKEN}&client_id=${process.env.DROPBOX_CLIENT_ID}&client_secret=${process.env.DROPBOX_CLIENT_SECRET}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
  })

  const data = await response.json()
  res.json(data)
})

export const syncSongs = asyncHandler(async (req, res) => {

  const accessToken = req.headers.authorization.split(' ')[1]
  const dropbox = new Dropbox({ accessToken })

  const files = await dropbox.filesListFolder({ path: '/SongBook/Română/' })

  for (let i = 0; i < files.result.entries.length; i++) {
    const file = files.result.entries[i]

    const existingSong = await Song.findOne({ title: file.name.split('.')[0] })
    if (!existingSong) {
      const song = await dropbox.filesDownload({ path: file.path_display })
      const newSong = new Song({
        title: file.name.split('.')[0],
        body: Buffer.from(song.result.fileBinary).toString(),
        lastModified: file.server_modified
      })

      await newSong.save()
    } else if (existingSong.lastModified !== file.server_modified) {
      const content = await dropbox.filesDownload({ path: file.path_display })

      existingSong.body = Buffer.from(content.result.fileBinary).toString()
      existingSong.lastModified = file.server_modified

      await existingSong.save()
    }
  }

  const songs = await Song.find()
  for (let i = 0; i < songs.length; i++) {
    const existingSong = files.result.entries.find(file => file.name === songs[i].title + '.pro')
    if (!existingSong) {
      await Song.deleteOne({ title: songs[i].title })

      const deletedSong = new DeletedSong({ title: songs[i].title, body: songs[i].body, lastModified: songs[i].lastModified })
      await deletedSong.save()
    }
  }

  const finalSongs = await Song.find()
  res.send(finalSongs)
})

export const getSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id.toString())

  res.json(song)
})

export const getSongs = asyncHandler(async (req, res) => {
  const { search, limit } = req.query

  function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ä,ă,â]')
      .replace(/e/g, '[e,é,ë]')
      .replace(/i/g, '[i,í,ï,î]')
      .replace(/o/g, '[o,ó,ö,ò]')
      .replace(/u/g, '[u,ü,ú,ù]')
      .replace(/t/g, '[t,ț]')
      .replace(/s/g, '[s,ș]')
  }

  const songs = await Song.find({ title: { $regex: diacriticSensitiveRegex(search) || '', $options: 'i' } }).collation({ locale: 'ro', strength: 1 }).limit(limit).sort({ title: 1 })
  res.json(songs)
})

export const syncPlaylists = asyncHandler(async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1]
  const dropbox = new Dropbox({ accessToken })

  const files = await dropbox.filesListFolder({ path: '/SongBook' })

  for (let i = 0; i < files.result.entries.length; i++) {
    const file = files.result.entries[i]

    if (file['.tag'] === 'file' && file.name.split('.')[1] === 'lst') {
      const existingPlaylist = await Playlist.findOne({ title: file.name.split('.')[0] })

      if (!existingPlaylist) {
        const content = await dropbox.filesDownload({ path: file.path_display })

        const playlist = new Playlist({
          title: content.result.name.split('.')[0],
          songs: Buffer.from(content.result.fileBinary).toString(),
          lastModified: file.server_modified
        })
        await playlist.save()
      } else if (existingPlaylist.lastModified !== file.server_modified) {
        const content = await dropbox.filesDownload({ path: file.path_display })

        existingPlaylist.songs = Buffer.from(content.result.fileBinary).toString()
        existingPlaylist.lastModified = file.server_modified

        await existingPlaylist.save()
      }
    }
  }

  const playlists = await Playlist.find()
  for (let i = 0; i < playlists.length; i++) {
    const existingPlaylist = files.result.entries.find(file => file.name === playlists[i].title + '.lst')
    if (!existingPlaylist) {
      await Playlist.deleteOne({ title: playlists[i].title })
    }
  }

  const finalPlaylists = await Playlist.find().sort({ lastModified: -1 })
  res.send(finalPlaylists)
})

export const getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id.toString())

  res.json(playlist)
})

export const getPlaylists = asyncHandler(async (req, res) => {
  const { search, limit } = req.query

  function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ä,ă,â]')
      .replace(/e/g, '[e,é,ë]')
      .replace(/i/g, '[i,í,ï,î]')
      .replace(/o/g, '[o,ó,ö,ò]')
      .replace(/u/g, '[u,ü,ú,ù]')
      .replace(/t/g, '[t,ț]')
      .replace(/s/g, '[s,ș]')
  }

  const playlists = await Playlist.find({ title: { $regex: diacriticSensitiveRegex(search) || '', $options: 'i' } }).collation({ locale: 'ro', strength: 1 }).limit(limit).sort({ lastModified: -1 })

  res.json(playlists)
})