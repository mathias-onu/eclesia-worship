import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SongsService } from 'src/app/core/services/songs.service';
import { ISong } from 'src/app/shared/models/song.model';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  searchSong = new FormControl('')
  songs!: ISong[] | null
  numberOfRequestedSongs: number = 30

  constructor(
    private songsService: SongsService
  ) { }

  ngOnInit(): void {
    this.songsService.getSongs(15).subscribe(res => {
      this.songs = res.body
    })

    this.searchSong.valueChanges.subscribe(data => {
      if (data === '') {
        this.songsService.getSongs(15).subscribe(res => {
          this.songs = res.body
        })
      }
      this.songsService.getSongs(undefined, data).subscribe(res => {
        this.songs = res.body
      })
    })
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight - 1) {
      this.songsService.getSongs(this.numberOfRequestedSongs).subscribe(res => {
        this.songs = res.body
        this.numberOfRequestedSongs += 15
      })
    }
  }

  addSongToPlaylist(song: ISong) {
    this.songsService.addSongToPlaylist(song)
  }

  syncSongs() {
    this.songsService.syncSongs().subscribe(() => console.log("Songs synced successfully!"))
  }
}
