import { IFormattedSong } from "./song.model"

export interface IPlaylist {
    _id: string,
    songs: IFormattedSong[],
    title: string,
    lastModified: string,
    __v: number
}

export interface IFormattedPlaylist {
    date: string,
    songs: IFormattedSong[]
}

export interface IFormattedCompletePlaylist {
    date: string,
    songs: IFormattedSong[]
}