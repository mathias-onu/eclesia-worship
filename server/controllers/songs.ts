import asyncHandler from "express-async-handler";
import Song from "../models/Song.js";
import DeletedSong from "../models/DeletedSong.js";
import { Request, Response } from "express";

import { Dropbox } from "dropbox";
import IUserRequest from "../interfaces/userRequest.js";
import User from "../models/User.js";
import ISong from "../interfaces/songModel.js";

export const getSong = asyncHandler(async (req: Request, res: Response) => {
  const song = await Song.findById(req.params.id);

  res.json({
    id: song.id,
    title: song.title,
    songText: song.songText,
    presentationText: song.presentationText,
    createdAt: song.createdAt,
    createdBy: song.createdBy
  });
});

export const getSongs = asyncHandler(async (req: Request, res: Response) => {
  const { search, limit } = req.query;

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

  const songs = await Song.find({
    title: {
      $regex: diacriticSensitiveRegex(search?.toString()) || "",
      $options: "i",
    },
  })
    .limit(Number(limit))
    .sort({ title: 1 }).select({ "__v": 0 });
  res.json(songs);
});

export const addSong = asyncHandler(async (req: IUserRequest, res: Response) => {
  const title: string = req.body.title
  const songText: string = req.body.songText
  const presentationText: string[] = req.body.presentationText
  if(!title || !songText) {
    res.status(400)
    throw new Error('Please fill in all the fields')
  }

  if(!presentationText) {
    res.status(400)
    throw new Error('Failed to format the song')
  }

  const existingSong = await Song.findOne({ title })
  if(existingSong) {
    res.status(400)
    throw new Error('Song already exists')
  }

  const newSong = new Song({
    title,
    songText,
    presentationText,
    createdBy: req.userId
  })

  const song: ISong = await newSong.save()
  res.json({
    id: song.id,
    title: song.title,
    songText: song.songText,
    presentationText: song.presentationText,
    createdAt: song.createdAt,
    createdBy: song.createdBy
  })
})

export const editSong = asyncHandler(async (req: Request, res: Response) => {
  const title: string = req.body.title
  const songText: string = req.body.songText
  const presentationText: string[] = req.body.presentationText

  const song: ISong = await Song.findById(req.params.id)
  if(!song) {
    res.status(404)
    throw new Error('Song not found')
  }

  song.title = title || song.title
  if(songText) {
    song.songText = songText
    song.presentationText = presentationText
  }

  const updatedSong: ISong = await song.save()

  res.json({
    id: updatedSong.id,
    title: updatedSong.title,
    songText: updatedSong.songText,
    presentationText: updatedSong.presentationText,
    createdAt: updatedSong.createdAt,
    createdBy: updatedSong.createdBy
  })
})

export const deleteSong = asyncHandler(async (req: Request, res: Response) => {
  const song: ISong = await Song.findById(req.params.id)
  if(!song) {
    res.status(404)
    throw new Error('Song not found')
  }

  await Song.findByIdAndDelete(song.id)

  res.json({
    msg: 'Song successfully removed'
  })
})