import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { SongsService } from 'src/app/core/services/songs.service';
import { IFormattedCompletePlaylist } from 'src/app/shared/models/playlist.model';
import { IFormattedSong } from 'src/app/shared/models/song.model';
import { FormatSongPipe } from 'src/app/shared/pipes/format-song.pipe';
import { AlertService } from 'src/app/shared/services/alert.service';
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

    selectPlaylistDialog.afterClosed().subscribe(playlist => {
      if (playlist) {
        this.localStorageService.clear('currentPlaylist')

        const formattedCompletePlaylist = {
          date: playlist.selectedPlaylist.date,
          songs: Array()
        }
        for (let i = 0; i < playlist.selectedPlaylist.songs.length; i++) {
          formattedCompletePlaylist.songs.push({
            title: playlist.selectedPlaylist.songs[i].split(' (')[0].split(' - ')[0],
            verses: []
          })
          this.songsService.setFormattedCompletePlaylist(formattedCompletePlaylist)
        }
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

  presentSong(song: any) {
    if (song.verses.length === 0) {
      const preSong = {
        title: song.title,
        verses: Array()
      }

      this.songsService.getSongs(undefined, song.title).subscribe((res) => {
        if (res!.body!.length !== 0) {
          preSong.verses = this.formatSong.transform(res.body![0]).verses
          this.currentPlaylist.songs.forEach(playlistSong => {
            if (playlistSong.title === preSong.title) {
              playlistSong.verses = preSong.verses
            }
          })
          this.songsService.setFormattedCompletePlaylist(this.currentPlaylist)
          this.songsService.setCurrentDisplayedSong(preSong)
        } else {
          this.alertService.openSnackBar(`Song "${song.title}" could not be found...`, 'error')
        }
      }
      )
    } else {
      this.songsService.setCurrentDisplayedSong(song)
    }

  }

  drop(event: CdkDragDrop<IFormattedSong[]>) {
    moveItemInArray(this.currentPlaylist.songs, event.previousIndex, event.currentIndex)
    this.songsService.setFormattedCompletePlaylist(this.currentPlaylist)
  }
}
