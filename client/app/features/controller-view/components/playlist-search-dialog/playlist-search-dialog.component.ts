import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SongsService } from 'client/app/core/services/songs.service';
import { IFormattedPlaylist, IPlaylist } from 'client/app/shared/models/playlist.model';
import { FormatPlaylistPipe } from 'client/app/shared/pipes/format-playlist.pipe';
import { AlertService } from 'client/app/shared/services/alert.service';

@Component({
  selector: 'app-playlist-search-dialog',
  templateUrl: './playlist-search-dialog.component.html',
  styleUrls: ['./playlist-search-dialog.component.scss']
})
export class PlaylistSearchDialogComponent implements OnInit {
  searchPlaylistsInput = new FormControl()
  playlists!: IPlaylist[] | null
  numberOfRequestedPlaylists!: number
  formattedPlaylist!: IFormattedPlaylist
  loadingPlaylists: boolean = false
  parsingPlaylist: boolean = false
  syncLoading: boolean = false

  constructor(
    public dialogRef: MatDialogRef<PlaylistSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private songsService: SongsService,
    private formatPlaylist: FormatPlaylistPipe,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadingPlaylists = true
    this.songsService.getPlaylists(15).subscribe(res => {
      if (res.body!.length === 0) {
        this.syncPlaylists()
      } else {
        this.playlists = res.body
      }
      this.loadingPlaylists = false
    })

    this.searchPlaylistsInput.valueChanges.subscribe(data => {
      if (data === '') {
        this.loadingPlaylists = true
        this.songsService.getPlaylists(15).subscribe(res => {
          this.playlists = res.body
          this.loadingPlaylists = false
        })
      }
    })
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
      this.songsService.getPlaylists(this.numberOfRequestedPlaylists).subscribe(res => {
        this.playlists = res.body
        this.numberOfRequestedPlaylists += 15
      })
    }
  }

  // calls playlist endpoint to parse and display available and unavailable songs
  displayPlaylistSongs(playlistSongs: IPlaylist, id: string) {
    this.parsingPlaylist = true
    this.formattedPlaylist = this.formatPlaylist.transform(playlistSongs)

    this.songsService.getPlaylist(id).subscribe({
      next: (res) => {
        const playlistSongs = res.body!.songs

        // modifies the formattedPlaylists songs to indicate unavailable songs
        for(let i = 0; i < playlistSongs.length; i++) {
          if (typeof playlistSongs[i].id === 'string') {
            this.formattedPlaylist.songs.splice(i, 1, { id: playlistSongs[i].id, title: playlistSongs[i].title, verses: [] })
          } else {
            this.formattedPlaylist.songs.splice(i, 1, { id: null, title: playlistSongs[i].title, verses: [] })
          }
        }

        this.parsingPlaylist = false
      },
      error: () => {
        this.parsingPlaylist = false
        this.alertService.openSnackBar('An error occurred getting the playlist...', 'error')
      }
    })
  }

  selectPlaylist() {
    this.dialogRef.close(this.formattedPlaylist)
  }

  syncPlaylists() {
    this.syncLoading = true
    this.songsService.syncPlaylists().subscribe({
      next: () => {
        this.songsService.getPlaylists(15).subscribe(res => {
          this.playlists = res.body
          this.syncLoading = false
          this.alertService.openSnackBar('Playlists have been synced successfully!', 'success')
        })
      },
      error: () => {
        this.syncLoading = false
        this.alertService.openSnackBar('An error occurred while syncing playlists...', 'error')
      }
    })
  }

  searchPlaylist() {
    this.loadingPlaylists = true
    this.songsService.getPlaylists(undefined, this.searchPlaylistsInput.value.toLowerCase().trim()).subscribe({
      next: res => {
        this.playlists = res.body
        this.loadingPlaylists = false
      },
      error: err => {
        this.alertService.openSnackBar(err.message, 'error')
        this.loadingPlaylists = false
      }
    })
  }
}
