import asyncHandler from "express-async-handler";
import Playlist from "../models/Playlist.js";
import { Request, Response } from "express";

import { Dropbox } from "dropbox";
import Song from "../models/Song.js";
import IUserRequest from "../interfaces/userRequest.js";
import IPlaylist from "../interfaces/playlistModel.js";
import ISong from "../interfaces/songModel.js";

function diacriticSensitiveRegex(string: string = "") {
  return string
    .replace(/a/g, "[a,á,à,ä,ă,â]")
    .replace(/e/g, "[e,é,ë]")
    .replace(/i/g, "[i,í,ï,î]")
    .replace(/o/g, "[o,ó,ö,ò]")
    .replace(/u/g, "[u,ü,ú,ù]")
    .replace(/t/g, "[t,ț]")
    .replace(/s/g, "[s,ș]");
}

export const newPlaylist = asyncHandler(async (req: IUserRequest, res: Response) => {
    const title: string = req.body.title;
    if (!title) {
      res.status(400);
      throw new Error("Please insert a playlist title");
    }

    const existingPlaylist: IPlaylist = await Playlist.findOne({ title });
    if (existingPlaylist) {
      res.status(400);
      throw new Error("Playlist title already taken");
    }

    const newPlaylist: IPlaylist = new Playlist({
      title,
      songs: [],
      createdBy: req.userId,
    });

    const playlist: IPlaylist = await newPlaylist.save();
    res.status(201);
    res.json({
      id: playlist.id,
      title: playlist.title,
      createdAt: playlist.createdAt,
      createdBy: playlist.createdBy,
      songs: playlist.songs,
    });
});

export const getPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const playlist: IPlaylist = await Playlist.findById(req.params.id)
    if(!playlist) {
        res.status(404)
        throw new Error('Playlist not found')
    }

    res.status(200)
    res.json({
        id: playlist.id,
        title: playlist.title,
        songs: playlist.songs,
        createdAt: playlist.createdAt,
        createdBy: playlist.createdBy
    })
});

export const getPlaylists = asyncHandler(async (req: Request, res: Response) => {
    const { search, limit } = req?.query;

    const playlists = await Playlist.find({
      title: {
        $regex: diacriticSensitiveRegex(search?.toString()) || "",
        $options: "i",
      },
    })
      .limit(Number(limit))
      .sort({ title: -1 })
      .select({ _id: 1, title: 1, createdAt: 1, createdBy: 1 });
    res.status(200)
    res.json(playlists);
});

export const deletePlaylist = asyncHandler(async (req: Request, res: Response) => {
    const playlist: IPlaylist = await Playlist.findById(req.params.id)
    if(!playlist) {
        res.status(404)
        throw new Error('Playlist not found')
    }

    await Playlist.findByIdAndDelete(playlist.id)
    res.status(200)
    res.json({
        msg: 'Playlist successfully deleted'
    })
})

export const editPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const title: string = req.body.title

    const playlist: IPlaylist = await Playlist.findById(req.params.id)
    if(!playlist) {
        res.status(404)
        throw new Error('Playlist not found')
    }

    playlist.title = title || playlist.title
    
    const editedPlaylist: IPlaylist = await playlist.save()
    res.status(200)
    res.json({
        id: editedPlaylist.id,
        title: editedPlaylist.title,
        songs: editedPlaylist.songs,
        createdAt: editedPlaylist.createdAt,
        createdBy: editedPlaylist.createdBy
    })
})

export const addSongToPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const playlist: IPlaylist = await Playlist.findById(req.params.playlistId)
    const song: ISong = await Song.findById(req.params.songId)

    if(!playlist) {
        res.status(404)
        throw new Error('Playlist not found')
    }

    if(!song) {
        res.status(404)
        throw new Error('Song not found')
    }

    const existingSong = playlist.songs.find(playlistSong => playlistSong.title === song.title)
    if(existingSong) {
        res.status(400)
        throw new Error('Song already in playlist')
    }

    playlist.songs.push({
        id: song.id,
        title: song.title,
        position: playlist.songs.length + 1
    })
    
    const savedPlaylist: IPlaylist = await playlist.save()
    res.status(200)
    res.json({
        id: savedPlaylist.id,
        title: savedPlaylist.title,
        songs: savedPlaylist.songs,
        createdAt: savedPlaylist.createdAt,
        createdBy: savedPlaylist.createdBy
    })
})

export const removeSongFromPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const playlist: IPlaylist = await Playlist.findById(req.params.playlistId)
    const song = playlist.songs.find(playlistSong => playlistSong.id.toString() === req.params.songId.toString())

    if(!playlist) {
        res.status(404)
        throw new Error('Playlist not found')
    }

    if(!song) {
        res.status(404)
        throw new Error('Song not found')
    }

    for(let i = 0; i < playlist.songs.length; i++) {
        const playlistSong = playlist.songs[i]

        if(playlistSong.position > song.position) {
            playlistSong.position -= 1
        }
    }

    for(let i = 0; i < playlist.songs.length; i++) {
        if(playlist.songs[i].id === song.id) {
            playlist.songs.splice(i, 1)
        }
    }

    const savedPlaylist = await playlist.save()
    res.status(200)
    res.json({
        id: savedPlaylist.id,
        title: savedPlaylist.title,
        songs: savedPlaylist.songs,
        createdAt: savedPlaylist.createdAt,
        createdBy: savedPlaylist.createdBy
    })
})

export const changeSongsPositions = asyncHandler(async (req: Request, res: Response) => {
    const songs = req.body.songs
    if(!songs) {
        res.status(400)
        throw new Error('Please enter some songs')
    }

    const playlist: IPlaylist = await Playlist.findById(req.params.id)
    if(!playlist) {
        res.status(404)
        throw new Error('Playlist not found')
    }

    playlist.songs = songs
    
    const savedPlaylist = await playlist.save()
    res.status(200)
    res.json({
        id: savedPlaylist.id,
        title: savedPlaylist.title,
        songs: savedPlaylist.songs,
        createdAt: savedPlaylist.createdAt,
        createdBy: savedPlaylist.createdBy
    })
})