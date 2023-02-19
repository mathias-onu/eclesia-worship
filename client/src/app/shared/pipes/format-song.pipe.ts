import { Pipe, PipeTransform } from '@angular/core';
import { ChordProParser, FormatterSettings, TextFormatter } from 'chordproject-parser';
import { IFormattedSong, ISong } from '../models/song.model';
import { chordProParser } from '../utils/chordProParser';
import { textTypeAccessor } from '../utils/textType.enum';

@Pipe({
  name: 'formatSong'
})
export class FormatSongPipe implements PipeTransform {

  transform(value: ISong): IFormattedSong {
    const formattedSong = chordProParser(value, textTypeAccessor.SONG)

    const song = formattedSong.join(' ').split("  ")
    let songObj = {
      title: value.title,
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
