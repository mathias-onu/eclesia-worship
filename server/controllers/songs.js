import asyncHandler from "express-async-handler";
import Song from "../models/Song.js";
import DeletedSong from "../models/DeletedSong.js";

import { Dropbox } from "dropbox";

export const syncSongs = asyncHandler(async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    const dropbox = new Dropbox({ accessToken });

    const files = await dropbox.filesListFolder({ path: "/SongBook/Română/" });

    for (let i = 0; i < files.result.entries.length; i++) {
        const file = files.result.entries[i];

        const existingSong = await Song.findOne({ title: file.name.split(".")[0] });
        if (!existingSong) {
            const song = await dropbox.filesDownload({ path: file.path_display });
            const newSong = new Song({
                title: file.name.split(".")[0],
                body: Buffer.from(song.result.fileBinary).toString(),
                lastModified: file.server_modified,
            });

            await newSong.save();
        } else if (existingSong.lastModified !== file.server_modified) {
            const content = await dropbox.filesDownload({ path: file.path_display });

            existingSong.body = Buffer.from(content.result.fileBinary).toString();
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

export const getSong = asyncHandler(async (req, res) => {
    const song = await Song.findOne({ title: req.params.title.toString() });

    res.json(song);
});

export const getSongs = asyncHandler(async (req, res) => {
    const { search, limit } = req.query;

    function diacriticSensitiveRegex(string = "") {
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
        title: { $regex: diacriticSensitiveRegex(search) || "", $options: "i" },
    })
        .collation({ locale: "ro", strength: 1 })
        .limit(limit).sort({ title: 1 });
    res.json(songs);
});

export const syncSongsPartial = asyncHandler(async (req, res) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    const dropbox = new Dropbox({ accessToken });

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
                const song = await dropbox.filesDownload({ path: file.path_display });
                const newSong = new Song({
                    title: file.name.split(".")[0],
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