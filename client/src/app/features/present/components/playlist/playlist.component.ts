import { Component, OnChanges } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { MessageService } from 'primeng/api';
import { SongsService } from '../../../../core/services/songs.service';
import { IFormattedCompletePlaylist } from '../../../../shared/models/playlist.model';
import { IFormattedSong } from '../../../../shared/models/song.model';
import { FormatSongPipe } from '../../../../shared/pipes/format-song.pipe';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PlaylistSearchDialogComponent } from '../playlist-search-dialog/playlist-search-dialog.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent implements OnChanges {
  @LocalStorage('currentPlaylist')
  currentPlaylist!: IFormattedCompletePlaylist

  ref: DynamicDialogRef | undefined;

  constructor(
    private localStorageService: LocalStorageService,
    private songsService: SongsService,
    private formatSong: FormatSongPipe,
    private messageService: MessageService,
    private dialog: DialogService,
  ) { }


  ngOnChanges(): void {
    console.log(this.currentPlaylist)
  }

  openSearchPlaylistsDialog() {
    this.ref = this.dialog.open(PlaylistSearchDialogComponent, {
      height: '90%',
      width: '60%'
    })

    this.ref!.onClose.subscribe((playlist: any) => {
      if (playlist) {
        this.localStorageService.clear('currentPlaylist')
        this.songsService.setFormattedCompletePlaylist(playlist.data)
      }
    })
  }

  removeSongFromPlaylist(song: IFormattedSong) {
    for (let i = 0; i < this.currentPlaylist.songs.length; i++) {
      if (this.currentPlaylist.songs[i] === song) {
        this.currentPlaylist.songs.splice(i, 1)
      }
    }
    this.songsService.setFormattedCompletePlaylist(this.currentPlaylist)
    if (this.songsService.currentDisplayedSong && song.title === this.songsService.currentDisplayedSong.title) {
      this.localStorageService.clear('currentDisplayedSong')
    }
  }

  presentSong(song: IFormattedSong) {
    const preSong = {
      id: song.id,
      title: song.title,
      verses: Array()
    }

    if (song.id !== null) {
      this.songsService.getSong(song.id).subscribe({
        next: res => {
          preSong.verses = this.formatSong.transform(res.body!).verses
          this.currentPlaylist.songs.forEach(playlistSong => {
            if (playlistSong.title === preSong.title) {
              playlistSong.verses = preSong.verses
            }
          })
          this.songsService.setFormattedCompletePlaylist(this.currentPlaylist)
          this.songsService.setCurrentDisplayedSong(preSong)
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: `Song "${song.title}" could not be found...` });
        }
      })
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'This song cannot be found...' });
    }
  }

  reorderedPlaylist() {
    this.songsService.setFormattedCompletePlaylist(this.currentPlaylist)
  }
}
