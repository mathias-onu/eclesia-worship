import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SongsService } from 'src/app/core/services/songs.service';
import { IBibleReference } from 'src/app/shared/models/bible.model';
import { ISong } from 'src/app/shared/models/song.model';
import { BibleBooksDialogComponent } from '../bible-books-dialog/bible-books-dialog.component';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss']
})
export class SongsComponent implements OnInit {
  searchSongInput = new FormControl('')
  songs!: ISong[] | null
  numberOfRequestedSongs: number = 30
  searchBibleInput = new FormControl('')
  searchedBiblePassage!: IBibleReference | null

  constructor(
    private songsService: SongsService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.songsService.getSongs(15).subscribe(res => {
      this.songs = res.body
    })

    this.searchSongInput.valueChanges.subscribe(song => {
      if (song === '') {
        this.songsService.getSongs(15).subscribe(res => {
          this.songs = res.body
        })
      }
      this.songsService.getSongs(undefined, song).subscribe(res => {
        this.songs = res.body
      })
    })

    this.searchBibleInput.valueChanges.subscribe(passage => {
      this.songsService.getBible(passage).subscribe({
        next: res => {
          if (res.body!.reference! && !res.body!.reference!.includes(":")! && res.body!.verses[0].verse !== 1) {
            res.body!.verses.shift()
            this.searchedBiblePassage = res.body ? res.body : null
          } else if (res.body!.reference!) {
            this.searchedBiblePassage = res.body ? res.body : null
          } else {
            this.searchedBiblePassage = null
          }
        },
        error: err => {
          console.log(err)
        }
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

  openBibleBooksDialog() {
    const bibleBooksDialog = this.dialog.open(BibleBooksDialogComponent, { height: '80vh', width: '500px' })

    bibleBooksDialog.afterClosed().subscribe(passage => {
      this.searchBibleInput.setValue(passage.data)
    })
  }
}
