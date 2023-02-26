import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { IPlaylist, IFormattedPlaylist } from 'src/app/shared/models/playlist.model';
import { ISong, IFormattedSong } from 'src/app/shared/models/song.model';
import { FormatPlaylistPipe } from 'src/app/shared/pipes/format-playlist.pipe';
import { FormatSongPipe } from 'src/app/shared/pipes/format-song.pipe';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  allSongs!: ISong[] | null
  allPlaylists!: IPlaylist[] | null
  formattedSong!: IFormattedSong
  formattedPlaylist!: IFormattedPlaylist

  constructor(
    private authService: AuthService,
    private songsService: SongsService,
    private formatSongPipe: FormatSongPipe,
    private formatPlaylistPipe: FormatPlaylistPipe
  ) { }

  ngOnInit(): void {
    // Check if user is authenticated
    this.authService.checkAuthenticationState()

    // this.getSongs()
    // this.getSong('63f0e2d73330b8036294a306')
    // this.getPlaylists()
    // this.getPlaylist('63f0ef343330b8036294a5f1')
  }

  getSongs(limit?: number) {
    this.songsService.getSongs(limit ? limit : undefined).subscribe(res => {
      this.allSongs = res.body
    })
  }

  getSong(songId: string) {
    this.songsService.getSong(songId).subscribe(res => {
      this.formattedSong = this.formatSongPipe.transform(res.body!)
    })
  }

  getPlaylists() {
    this.songsService.getPlaylists().subscribe(res => {
      this.allPlaylists = res.body
    })
  }

  getPlaylist(playlistId: string) {
    this.songsService.getPlaylist(playlistId).subscribe(res => {
      this.formattedPlaylist = this.formatPlaylistPipe.transform(res.body!)
    })
  }

  syncSongs() {
    this.songsService.syncSongs().subscribe(res => {
      if (res.status === 200) {
        console.log("Playlists successfully synced!")
      } else {
        console.log("An error occurred while syncing the songs...")
      }
    })
  }

  syncPlaylists() {
    this.songsService.syncPlaylists().subscribe(res => {
      if (res.status === 200) {
        console.log("Playlists successfully synced!")
      } else {
        console.log("An error occurred while syncing the playlists...")
      }
    })
  }
}
