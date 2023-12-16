import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { SongsService } from 'client/app/core/services/songs.service';
import { IFormattedCompletePlaylist, IFormattedPlaylist } from 'client/app/shared/models/playlist.model';
import { IFormattedSong } from 'client/app/shared/models/song.model';
import { FormatSongPipe } from 'client/app/shared/pipes/format-song.pipe';
import { AlertService } from 'client/app/shared/services/alert.service';
import { PlaylistSearchDialogComponent } from '../playlist-search-dialog/playlist-search-dialog.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  @LocalStorage('currentPlaylist')
  currentPlaylist!: IFormattedCompletePlaylist

  constructor(
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,
    private songsService: SongsService,
    private formatSong: FormatSongPipe,
    private alertService: AlertService
  ) { }

  ngOnInit(): void { }

  openSearchPlaylistsDialog() {
    const selectPlaylistDialog = this.dialog.open(PlaylistSearchDialogComponent, {
      height: '700px',
      width: '550px'
    })

    selectPlaylistDialog.afterClosed().subscribe((playlist: IFormattedPlaylist) => {
      if (playlist) {
        this.localStorageService.clear('currentPlaylist')
        this.songsService.setFormattedCompletePlaylist(playlist)
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
          this.alertService.openSnackBar(`Song "${song.title}" could not be found...`, 'error')
        }
      })
    } else {
      this.alertService.openSnackBar(`This song cannot not be found...`, 'error')
    }
  }


  drop(event: CdkDragDrop<IFormattedSong[]>) {
    moveItemInArray(this.currentPlaylist.songs, event.previousIndex, event.currentIndex)
    this.songsService.setFormattedCompletePlaylist(this.currentPlaylist)
  }
}
