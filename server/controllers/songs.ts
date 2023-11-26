import asyncHandler from "express-async-handler";
import Song from "../models/Song.js";
import DeletedSong from "../models/DeletedSong.js";
import { Request, Response } from "express"

import { Dropbox } from "dropbox";

export const syncSongs = asyncHandler(async (req: Request, res: Response) => {
    const accessToken: string = req.headers.authorization!.split(" ")[1];
    const dropbox: Dropbox = new Dropbox({ accessToken });

    const files = await dropbox.filesListFolder({ path: "/SongBook/Română/" });

    for (let i = 0; i < files.result.entries.length; i++) {
        const file = files.result.entries[i];

        const existingSong = await Song.findOne({ title: file.name.split(".")[0] });
        if (!existingSong) {
            // @ts-ignore
            const song = await dropbox.filesDownload({ path: file.path_display });
            const newSong = new Song({
                title: file.name.split(".")[0],
                // @ts-ignore
                body: Buffer.from(song.result.fileBinary).toString(),
                // @ts-ignore
                lastModified: file.server_modified,
            });

            await newSong.save();
            // @ts-ignore
        } else if (existingSong.lastModified !== file.server_modified) {
            // @ts-ignore
            const content = await dropbox.filesDownload({ path: file.path_display });

            // @ts-ignore
            existingSong.body = Buffer.from(content.result.fileBinary).toString();
            // @ts-ignore
            existingSong.lastModified = file.server_modified;

            await existingSong.save();
        }
    }

    const songs = await Song.find();
    for (let i = 0; i < songs.length; i++) {
        const existingSong = files.result.entries.find(
            (file) => file.name === songs[i].title + ".pro"
        );
        if (!existingSong) {
            await Song.deleteOne({ title: songs[i].title });

            const deletedSong = new DeletedSong({
                title: songs[i].title,
                body: songs[i].body,
                lastModified: songs[i].lastModified,
            });
            await deletedSong.save();
        }
    }

    const finalSongs = await Song.find().sort({ title: 1 });
    res.send(finalSongs);
});

export const getSong = asyncHandler(async (req: Request, res: Response) => {
    const song = await Song.findOne({ title: req.params.title.toString() });

    res.json(song);
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
        title: { $regex: diacriticSensitiveRegex(search?.toString()) || "", $options: "i" },
    })
        .limit(Number(limit)).sort({ title: 1 });
    res.json(songs);
});

export const syncSongsPartial = asyncHandler(async (req: Request, res: Response) => {
    const accessToken: string = req.headers.authorization!.split(" ")[1];
    const dropbox: Dropbox = new Dropbox({ accessToken });

    const files = await dropbox.filesListFolder({ path: "/SongBook/Română/" });

    for (let i = 0; i < files.result.entries.length; i++) {
        const file = files.result.entries[i];

        if (
            file.name.includes('Mă-nchin, o, Doamne') ||
            file.name.includes('Slavă și cinste') ||
            file.name.includes('Salvat!') ||
            file.name.includes('Ție laudă-Ți cântăm') ||
            file.name.includes('Și munții tresaltă')
        ) {
            const existingSong = await Song.findOne({ title: file.name.split('.')[0] })
            if (!existingSong) {
                // @ts-ignore
                const song = await dropbox.filesDownload({ path: file.path_display });
                const newSong = new Song({
                    title: file.name.split(".")[0],
                    // @ts-ignore
                    body: Buffer.from(song.result.fileBinary).toString(),
                    // @ts-ignore
                    lastModified: file.server_modified
                })

                await newSong.save()
                // @ts-ignore
            } else if (existingSong.lastModified !== file.server_modified) {
                // @ts-ignore
                const content = await dropbox.filesDownload({ path: file.path_display })

                // @ts-ignore
                existingSong.body = Buffer.from(content.result.fileBinary).toString()
                // @ts-ignore
                existingSong.lastModified = file.server_modified

                await existingSong.save()
            }
        }
    }

    const songs = await Song.find();
    for (let i = 0; i < songs.length; i++) {
        const existingSong = files.result.entries.find(
            (file) => file.name === songs[i].title + ".pro"
        );
        if (!existingSong) {
            await Song.deleteOne({ title: songs[i].title });

            const deletedSong = new DeletedSong({
                title: songs[i].title,
                body: songs[i].body,
                lastModified: songs[i].lastModified,
            });
            await deletedSong.save();
        }
    }

    const finalSongs = await Song.find();
    res.send(finalSongs);
});