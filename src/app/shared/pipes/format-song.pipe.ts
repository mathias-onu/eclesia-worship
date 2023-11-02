import { Pipe, PipeTransform } from '@angular/core';
import { IFormattedSong, ISong } from '../models/song.model';
import { chordProParser } from '../utils/chordProParser';
import { TextTypeAccessor } from '../utils/textType.enum';

@Pipe({
  name: 'formatSong'
})
export class FormatSongPipe implements PipeTransform {

  transform(value: ISong): IFormattedSong {
    const formattedSong = chordProParser(value, TextTypeAccessor.SONG)

    const songContent: IFormattedSong = {
      title: value.title,
      verses: [
        { verseIndex: 0, lines: [] }
      ]
    }

    let verseCount: number = 0
    for(let i = 0; i < formattedSong.length; i++) {
      if(formattedSong[i] !== "" && formattedSong[i] !== '**********') {
        verseCount++
      } else {
        verseCount = 0
      }
      
      if(verseCount > 2) {
        formattedSong.splice(i, 0, "")
        verseCount = 0;
      }
    }

    const song = [...formattedSong]

    let verseIndex: number = 0

    for (let i = 0; i < song.length; i++) {
      const line = song[i]
      
      if (line === "" && i !== song.length - 1) {
        verseIndex++
        songContent.verses.push({ verseIndex: verseIndex, lines: [] })
      } else if (verseIndex > 0 && !line.includes('#') && line !== "") {
        songContent.verses[verseIndex].lines.push(line)
      }
    }
    songContent.verses.shift()

    for (let i = 0; i < songContent.verses.length; i++) {
      const slide = songContent.verses[i]
      if (slide.lines.length === 4) {
        songContent.verses.splice(i, 1)
        const nextSlide = { verseIndex: i + 1, lines: [slide.lines[2], slide.lines[3]] }
        slide.lines.pop()
        slide.lines.pop()
        songContent.verses.splice(i, 0, slide)
        songContent.verses.splice(i + 1, 0, nextSlide)
      }
    }

    for (let i = 0; i < songContent.verses.length; i++) {
      if (songContent.verses[i].lines.length === 0) {
        songContent.verses.splice(i, 1)
      }
    }

    return songContent
  }
}
