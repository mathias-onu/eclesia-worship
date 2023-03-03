import { Pipe, PipeTransform } from '@angular/core';
import { IFormattedSong, ISong } from '../models/song.model';
import { chordProParser } from '../utils/chordProParser';
import { textTypeAccessor } from '../utils/textType.enum';

@Pipe({
  name: 'formatSong'
})
export class FormatSongPipe implements PipeTransform {

  transform(value: ISong): IFormattedSong {
    const formattedSong = chordProParser(value, textTypeAccessor.SONG)

    console.log(formattedSong)

    const songContent: any = {
      title: value.title,
      verses: [
        { verse: 0, lines: [] }
      ]
    }
    let verseIndex = 0
    for (let i = 0; i < formattedSong.length; i++) {
      const line = formattedSong[i]

      if (line === "" && i !== formattedSong.length - 1) {
        verseIndex++
        songContent.verses.push({ verse: verseIndex, lines: [] })
      } else if (verseIndex > 0 && !line.includes('#')) {
        songContent.verses[verseIndex].lines.push(line)
      }
    }

    songContent.verses.shift()

    console.log(songContent)

    const song = formattedSong.join(' ').split("  ")
    let songObj = {
      title: value.title.split(' (')[0].split(' - ')[0],
      verses: Array()
    }

    for (let i = 0; i < song.length; i++) {
      if (i !== 0 && !song[i].includes("#")) {
        songObj.verses.push(song[i])
      }
    }

    return songObj
  }
}
