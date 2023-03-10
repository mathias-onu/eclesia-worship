import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SongsService } from 'src/app/core/services/songs.service';
import { IFormattedPlaylist, IPlaylist } from 'src/app/shared/models/playlist.model';
import { FormatPlaylistPipe } from 'src/app/shared/pipes/format-playlist.pipe';

@Component({
  selector: 'app-playlist-search-dialog',
  templateUrl: './playlist-search-dialog.component.html',
  styleUrls: ['./playlist-search-dialog.component.scss']
})
export class PlaylistSearchDialogComponent implements OnInit {
  searchPlaylist = new FormControl()
  playlists!: IPlaylist[] | null
  numberOfRequestedPlaylists!: number
  formattedPlaylist!: IFormattedPlaylist

  constructor(
    public dialogRef: MatDialogRef<PlaylistSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private songsService: SongsService,
    private formatPlaylist: FormatPlaylistPipe
  ) { }

  ngOnInit(): void {
    this.songsService.getPlaylists(15).subscribe(res => {
      this.playlists = res.body
    })

    this.searchPlaylist.valueChanges.subscribe(data => {
      this.songsService.getPlaylists(undefined, data!.toLowerCase().trim()).subscribe(res => {
        this.playlists = res.body
      })
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
    this.songsService.syncPlaylists().subscribe(() => {
      console.log("Playlists synced successfully!")
      this.songsService.getPlaylists(15).subscribe(res => {
        this.playlists = res.body
      })
    })
  }
}
