import { Component, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SongsService } from '../../../../core/services/songs.service';
import { IPlaylist, IFormattedPlaylist } from '../../../../shared/models/playlist.model';
import { FormatPlaylistPipe } from '../../../../shared/pipes/format-playlist.pipe';
import { MessageService } from 'primeng/api';
import { ISong } from '../../../../shared/models/song.model';

@Component({
  selector: 'app-playlist-search-dialog',
  templateUrl: './playlist-search-dialog.component.html',
  styleUrl: './playlist-search-dialog.component.scss'
})
export class PlaylistSearchDialogComponent {
  searchPlaylistsInput = new FormControl()
  playlists!: IPlaylist[] | null
  numberOfRequestedPlaylists!: number
  formattedPlaylist!: IFormattedPlaylist
  loadingPlaylists: boolean = false
  parsingPlaylist: boolean = false
  syncLoading: boolean = false

  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  constructor(
    public dialogRef: DynamicDialogRef,
    private songsService: SongsService,
    private formatPlaylist: FormatPlaylistPipe,
    private messageService: MessageService
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
  displayPlaylistSongs(index: number) {
    const playlistSongs = this.playlists![index]
    const id = this.playlists![index]._id

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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred getting the playlist...' })
      }
    })
  }

  selectPlaylist() {
    this.dialogRef.close({ data: this.formattedPlaylist })
  }

  syncPlaylists() {
    this.syncLoading = true
    this.songsService.syncPlaylists().subscribe({
      next: () => {
        this.songsService.getPlaylists(15).subscribe(res => {
          this.playlists = res.body
          this.syncLoading = false
          this.messageService.add({ severity: 'success', summary: 'Successfull sync', detail: 'Playlists have been synced successfully!' })
        })
      },
      error: () => {
        this.syncLoading = false
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while syncing playlists...' })
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
        this.loadingPlaylists = false
      }
    })
  }
}
