export interface IBible {
    oldTestament: IBibleBook[]
    newTestament: IBibleBook[]
}

export interface IBibleBook {
    title: string,
    chapters: number[]
}

export interface IBiblePassageSlide {
    slideIndex: number,
    text: string
}

export interface IBibleVerse {
    _id: number,
    book: string,
    chapter: number
    number: number,
    text: string
    __v: number
}