import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { SongsService } from 'src/app/core/services/songs.service';
import { IFormattedCompletePlaylist } from 'src/app/shared/models/playlist.model';
import { IFormattedSong } from 'src/app/shared/models/song.model';
import { FormatSongPipe } from 'src/app/shared/pipes/format-song.pipe';
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
    private formatSong: FormatSongPipe
  ) { }

  ngOnInit(): void { }

  openSearchPlaylistsDialog() {
    const selectPlaylistDialog = this.dialog.open(PlaylistSearchDialogComponent, {
      height: '550px',
      width: '550px'
    })

    selectPlaylistDialog.afterClosed().subscribe(playlist => {
      if (playlist) {
        this.localStorageService.clear('currentPlaylist')

        const formattedCompletePLaylist = {
          date: playlist.selectedPlaylist.date,
          songs: Array()
        }
        for (let i = 0; i < playlist.selectedPlaylist.songs.length; i++) {
          this.songsService.getSongs(undefined, playlist.selectedPlaylist.songs[i].split(' (')[0].split(' - ')[0]).subscribe(
            (song) => {
              if (song!.body!.length !== 0) {
                formattedCompletePLaylist.songs.push(this.formatSong.transform(song.body![0]))
                this.songsService.setFormattedCompletePlaylist(formattedCompletePLaylist)
              } else {
                console.error(`Song "${playlist.selectedPlaylist.songs[i].split(' (')[0].split(' - ')[0]}" could not be found...`)
              }
            }
          )
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
  }

  presentSong(song: any) {
    this.songsService.setCurrentDisplayedSong(song)
  }

  drop(event: CdkDragDrop<IFormattedSong[]>) {
    moveItemInArray(this.currentPlaylist.songs, event.previousIndex, event.currentIndex)
    this.songsService.setFormattedCompletePlaylist(this.currentPlaylist)
  }
}
