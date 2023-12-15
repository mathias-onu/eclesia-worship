import asyncHandler from "express-async-handler";
import Playlist from "../models/Playlist.js";
import { Request, Response } from "express"

import { Dropbox } from "dropbox";

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

export const syncPlaylists = asyncHandler(async (req: Request, res: Response) => {
    const accessToken: string = req.headers.authorization!.split(" ")[1];
    const dropbox: Dropbox = new Dropbox({ accessToken });

    const files = await dropbox.filesListFolder({ path: "/SongBook" });

    for (let i = 0; i < files.result.entries.length; i++) {
        const file = files.result.entries[i];

        if (file[".tag"] === "file" && file.name.split(".")[1] === "lst") {
            const existingPlaylist = await Playlist.findOne({
                title: file.name.split(".")[0],
            });

            if (!existingPlaylist) {
                const content = await dropbox.filesDownload({
                    // @ts-ignore
                    path: file.path_display,
                });

                const playlist = new Playlist({
                    title: content.result.name.split(".")[0],
                    // @ts-ignore
                    songs: Buffer.from(content.result.fileBinary).toString(),
                    lastModified: file.server_modified,
                });
                
                await playlist.save();
            } else if (existingPlaylist.lastModified !== file.server_modified) {
                const content = await dropbox.filesDownload({
                    // @ts-ignore
                    path: file.path_display,
                });

                existingPlaylist.songs = Buffer.from(
                    // @ts-ignore
                    content.result.fileBinary
                ).toString();
                existingPlaylist.lastModified = file.server_modified;

                await existingPlaylist.save();
            }
        }
    }

    const playlists = await Playlist.find();
    for (let i = 0; i < playlists.length; i++) {
        const existingPlaylist = files.result.entries.find(
            (file) => file.name === playlists[i].title + ".lst"
        );
        if (!existingPlaylist) {
            await Playlist.deleteOne({ title: playlists[i].title });
        }
    }

    const finalPlaylists = await Playlist.find().sort({ title: -1 })
    res.json(finalPlaylists)
})

export const syncPlaylistsPartial = asyncHandler(async (req: Request, res: Response) => {
    const accessToken: string = req.headers.authorization!.split(" ")[1];
    const dropbox: Dropbox = new Dropbox({ accessToken });

    const files = await dropbox.filesListFolder({ path: "/SongBook" });

    for (let i = 0; i < files.result.entries.length; i++) {
        const file = files.result.entries[i];

        if (
            file[".tag"] === "file" &&
            file.name.split(".")[1] === "lst" &&
            file.name === "2023-01-29.lst"
        ) {
            const existingPlaylist = await Playlist.findOne({
                title: file.name.split(".")[0],
            });

            if (!existingPlaylist) {
                const content = await dropbox.filesDownload({
                    // @ts-ignore
                    path: file.path_display,
                });

                const playlist = new Playlist({
                    title: content.result.name.split(".")[0],
                    //@ts-ignore
                    songs: Buffer.from(content.result.fileBinary).toString(),
                    lastModified: file.server_modified,
                });
                await playlist.save();
            } else if (existingPlaylist.lastModified !== file.server_modified) {
                const content = await dropbox.filesDownload({
                    // @ts-ignore
                    path: file.path_display,
                });

                existingPlaylist.songs = Buffer.from(
                    // @ts-ignore
                    content.result.fileBinary
                ).toString();
                existingPlaylist.lastModified = file.server_modified;

                await existingPlaylist.save();
            }
        }
    }

    const playlists = await Playlist.find();
    for (let i = 0; i < playlists.length; i++) {
        const existingPlaylist = files.result.entries.find(
            (file) => file.name === playlists[i].title + ".lst"
        );
        if (!existingPlaylist) {
            await Playlist.deleteOne({ title: playlists[i].title });
        }
    }

    const finalPlaylists = await Playlist.find()
    res.send(finalPlaylists)
})

export const getPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const playlist = await Playlist.findById(req.params.id.toString());

    res.json(playlist);
});

export const getPlaylists = asyncHandler(async (req: Request, res: Response) => {
    const { search, limit } = req?.query;


    const playlists = await Playlist.find({
        title: { $regex: diacriticSensitiveRegex(search?.toString()) || "", $options: "i" },
    })
        .limit(Number(limit)).sort({ title: -1 });

    res.json(playlists);
});