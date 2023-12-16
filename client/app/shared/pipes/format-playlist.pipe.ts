import { Pipe, PipeTransform } from '@angular/core';
import { IFormattedPlaylist, IPlaylist } from '../models/playlist.model';
import { chordProParser } from '../utils/chordProParser';
import { TextTypeAccessor } from '../utils/textType.enum';

@Pipe({
  name: 'formatPlaylist'
})
export class FormatPlaylistPipe implements PipeTransform {

  transform(value: IPlaylist): IFormattedPlaylist {
    const formattedPlaylist = chordProParser(value, TextTypeAccessor.PLAYLIST)
    formattedPlaylist.pop()

    let playlistObj = {
      date: value.title,
      songs: Array()
    }

    for (let i = 0; i < formattedPlaylist.length; i++) {
      if (i !== 0 && i !== 1 && i !== 2) {
        playlistObj.songs.push({ id: value._id, title: formattedPlaylist[i], verses: [] });
      }
    }

    return playlistObj
  }
}
