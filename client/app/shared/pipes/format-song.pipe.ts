import { Pipe, PipeTransform } from '@angular/core';
import { IFormattedSong, ISong } from '../models/song.model';
import { chordProParser } from '../utils/chordProParser';
import { TextTypeAccessor } from '../utils/textType.enum';

@Pipe({
  name: 'formatSong'
})
export class FormatSongPipe implements PipeTransform {

  transform(value: ISong): IFormattedSong {
    // song is parsed and converted into an array of strings
    const formattedSong = chordProParser(value, TextTypeAccessor.SONG)

    // after the process, the song will be converted into an object
    const songContent: IFormattedSong = {
      id: value._id,
      title: value.title,
      verses: [
        { verseIndex: 0, lines: [] }
      ]
    }

    console.log(formattedSong)

    // the loop will detect any verses containing more than 2 lines and will split them
    let verseCount: number = 0
    for(let i = 0; i < formattedSong.length; i++) {
      if(formattedSong[i] !== "" && formattedSong[i] !== '**********') {
        // the loop will count how many lines are in a verse
        verseCount++
      } else {
        // if a line is empty it means that the verse has ended and it will start counting form the beginning
        verseCount = 0
      }
      
      if(verseCount > 2) {
        // if there are more than two lines it will insert an empty line after the second line
        formattedSong.splice(i, 0, "")
        verseCount = 0;
      }
    }

    const song = [...formattedSong]

    let verseIndex: number = 0

    // this loop will map the song array into an object
    for (let i = 0; i < song.length; i++) {
      const line = song[i]
      
      if (line === "" && i !== song.length - 1) {
        // if a line is empty this means it needs to insert a new verse
        verseIndex++
        songContent.verses.push({ verseIndex: verseIndex, lines: [] })
      } else if (verseIndex > 0 && !line.includes('#') && line !== "") {
        // whenever there isn't an empty line it will be inserted into the verse
        songContent.verses[verseIndex].lines.push(line)
      }
    }

    // removes the title of the song
    songContent.verses.shift()

    // this loop will detect if there's an author verse and will remove it
    for(let i = 0; i < songContent.verses[0].lines.length; i++) {
      const verse = songContent.verses[0].lines[i]
      if(verse === "**********") {
        songContent.verses.shift()
      }
    }

    return songContent
  }
}
