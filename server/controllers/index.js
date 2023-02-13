import asyncHandler from 'express-async-handler'
import fetch from 'node-fetch'
import Song from '../models/Song.js'
import Playlist from '../models/Playlist.js'

const config = {
  fetch,
  clientId: process.env.DROPBOX_CLIENT_ID,
};

import { Dropbox } from 'dropbox'; // eslint-disable-line import/no-unresolved

const dbx = new Dropbox(config);

const redirectUri = `http://localhost:${process.env.PORT}/auth`;

export const authUser = asyncHandler(async (req, res) => {
  const { code } = req.query;
  console.log(`code:${code}`);

  dbx.auth.getAccessTokenFromCode(redirectUri, code)
    .then((token) => {
      console.log(`Token Result:${JSON.stringify(token)}`);
      dbx.auth.setRefreshToken(token.result.refresh_token);
      dbx.usersGetCurrentAccount()
        .then((response) => {
          res.json(response)
        })
        .catch((error) => {
          res.status(400)
          res.send(error);
        });
    })
    .catch((error) => {
      res.status(400)
      res.send(error);
    })
})

export const refreshToken = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body
  const response = await fetch("https://api.dropbox.com/oauth2/token", {
    body: `grant_type=refresh_token&refresh_token=PLJG5JIjZE0AAAAAAAAAAW3nwPMYAZV6HpIYrlYbmXSl3i0SH2Pa5ek54Rl1ll90&client_id=${process.env.DROPBOX_CLIENT_ID}&client_secret=${process.env.DROPBOX_CLIENT_SECRET}`,
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
    const content = await dropbox.filesDownload({ path: file.path_display })
    const title = content.result.name.split('.pro')[0]
    const existingSong = await Song.findOne({ title })

    if (existingSong) {
      existingSong.body = Buffer.from(content.result.fileBinary).toString()
      await existingSong.save()
    } else {
      const song = new Song({
        title,
        body: Buffer.from(content.result.fileBinary).toString()
      })

      await song.save()
    }
  }
  res.send('success')
})

export const getSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id.toString())

  res.json(song)
})

export const getSongs = asyncHandler(async (req, res) => {
  const { search } = req.query

  function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ä,ă,â]')
      .replace(/e/g, '[e,é,ë]')
      .replace(/i/g, '[i,í,ï,î]')
      .replace(/o/g, '[o,ó,ö,ò]')
      .replace(/u/g, '[u,ü,ú,ù]')
      .replace(/t/g, '[t,ț]')
      .replace(/s/g, '[s,ș]')
  }

  const songs = await Song.find({ title: { $regex: diacriticSensitiveRegex(search) || '', $options: 'i' } }).collation({ locale: 'ro', strength: 1 }).sort({ title: 1 })
  res.json(songs)
})

export const syncPlaylists = asyncHandler(async (req, res) => {
  const accessToken = req.headers.authorization.split(' ')[1]
  const dropbox = new Dropbox({ accessToken })

  const files = await dropbox.filesListFolder({ path: '/SongBook' })

  for (let i = 0; i < files.result.entries.length; i++) {
    const file = files.result.entries[i]

    if (file['.tag'] === 'file' && file.name.split('.')[1] === 'lst') {
      const content = await dropbox.filesDownload({ path: file.path_display })
      const existingPlaylist = await Playlist.findOne({ title: content.result.name.split('.')[0] })

      if (existingPlaylist) {
        existingPlaylist.songs = Buffer.from(content.result.fileBinary).toString()
      } else {
        const playlist = new Playlist({
          title: content.result.name.split('.')[0],
          songs: Buffer.from(content.result.fileBinary).toString()
        })
        await playlist.save()
      }
    }
  }

  res.send('success')
})

export const getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findById(req.params.id.toString())

  res.json(playlist)
})

export const getPlaylists = asyncHandler(async (req, res) => {
  const { search } = req.query

  function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ä,ă,â]')
      .replace(/e/g, '[e,é,ë]')
      .replace(/i/g, '[i,í,ï,î]')
      .replace(/o/g, '[o,ó,ö,ò]')
      .replace(/u/g, '[u,ü,ú,ù]')
      .replace(/t/g, '[t,ț]')
      .replace(/s/g, '[s,ș]')
  }

  const playlists = await Playlist.find({ title: { $regex: diacriticSensitiveRegex(search) || '', $options: 'i' } }).collation({ locale: 'ro', strength: 1 }).sort({ title: 1 })

  res.json(playlists)
})

export const dummy = asyncHandler(async (req, res) => {
  const dropbox = new Dropbox({ accessToken: req.headers.authorization.split(' ')[1] })

  const files = await dropbox.filesListFolderContinue({ cursor: 'AAHaE5F2YJmdy0nGInVh07Ys8MkJXbWuqLHWJ9PMh--wFx6wxxSnq7fHrbApT8YAqkZ4bK2hdPu2cMyaEDMwnap_uiFdsgh9qei_YDVSkZ4FAUviKbrInxdyzr8Jcc8PmlxG2rbs7lHV4c1JaAh2DzR0iG1rO4axgUnnF1S50ETtfKCWIfHe2k69iaoSvp_Adyjq5l4D1ytFWXeUH00g8zP120M-FO0mLYLtozWJWrTU57MipHX0DVYAbTNFinAqcXoQ3k_ozqf-rfaXUj4vrvjnCihLESPNHqBdeFz9Fq4Eyg' })
  res.json(files)
})