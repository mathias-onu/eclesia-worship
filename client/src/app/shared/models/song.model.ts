export interface ISong {
    _id: string,
    body: string,
    lastModified: string,
    title: string,
    __v: number
}

export interface IFormattedSong {
    title: string,
    verses: string[]
}