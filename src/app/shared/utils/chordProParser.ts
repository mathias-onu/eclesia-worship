import { ChordProParser, FormatterSettings, TextFormatter } from "chordproject-parser";

export const chordProParser = (text: any, textTypeIdentifier: string) => {
    const parser = new ChordProParser()
    const parsedSong = parser.parse(textTypeIdentifier === "body" ? text.body : text.songs)
    const settings = new FormatterSettings()
    settings.showChords = false
    const formatter = new TextFormatter(settings)
    const formattedSong = formatter.format(parsedSong)

    return formattedSong
}