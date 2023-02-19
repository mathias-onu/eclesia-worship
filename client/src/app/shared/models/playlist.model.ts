export interface IPlaylist {
    _id: string,
    songs: string,
    title: string,
    lastModified: string,
    __v: number
}

export interface IFormattedPlaylist {
    date: string,
    songs: string[]
}