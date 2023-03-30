import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SongsService } from 'src/app/core/services/songs.service';
import { IFormattedPlaylist, IPlaylist } from 'src/app/shared/models/playlist.model';
import { FormatPlaylistPipe } from 'src/app/shared/pipes/format-playlist.pipe';
import { AlertService } from 'src/app/shared/services/alert.service';

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

  displayPlaylistSongs(playlistSongs: IPlaylist) {
    this.formattedPlaylist = this.formatPlaylist.transform(playlistSongs)
  }

  selectPlaylist(playlist: IPlaylist) {
    this.dialogRef.close({ selectedPlaylist: this.formatPlaylist.transform(playlist) })
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
    this.songsService.getPlaylists(undefined, this.searchPlaylistsInput.value.toLowerCase().trim()).subscribe(res => {
      this.playlists = res.body
      this.loadingPlaylists = false
    })
  }
}
