export interface IBibleReference {
    verses: IBibleVerse[]
    text: string,
    reference: string,
    translation_id: string,
    translation_name: string,
    translation_note: string
}

export interface IBibleVerse {
    text: string,
    verse: number,
    chapter: number,
    book_id: string,
    book_name: string,
}

export interface IBible {
    oldTestament: IBibleBook[]
    newTestament: IBibleBook[]
}

export interface IBibleBook {
    title: string,
    chapters: number[]
}