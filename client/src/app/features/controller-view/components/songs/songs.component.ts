import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BibleService } from 'src/app/core/services/bible.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { IBiblePassageSlide, IBibleReference, IBibleVerse } from 'src/app/shared/models/bible.model';
import { ISong } from 'src/app/shared/models/song.model';
import { AlertService } from 'src/app/shared/services/alert.service';
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
  syncLoading: boolean = false

  constructor(
    private songsService: SongsService,
    private bibleService: BibleService,
    private dialog: MatDialog,
    private alertService: AlertService
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
      this.bibleService.getBible(passage).subscribe({
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
    this.syncLoading = true
    this.songsService.syncSongs().subscribe({
      next: (res) => {
        this.songs = res.body
        this.syncLoading = false
        this.alertService.openSnackBar('Songs have been synced successfully!', 'success')
      },
      error: () => {
        this.syncLoading = false
        this.alertService.openSnackBar('An error occurred while syncing songs...', 'error')
      }
    })
  }

  openBibleBooksDialog() {
    const bibleBooksDialog = this.dialog.open(BibleBooksDialogComponent, { height: '80vh', width: '500px' })

    bibleBooksDialog.afterClosed().subscribe(passage => {
      if (passage) {
        this.searchBibleInput.setValue(passage.data)
      }
    })
  }

  addPassageToPresentation(passage: IBibleReference) {
    const verses = passage.verses
    const presentationSlides: IBiblePassageSlide[] = [{ slideIndex: 1, text: "" }]
    let slideCount = 0

    for (let i = 0; i < verses.length; i++) {
      if (presentationSlides[slideCount].text.length < 500) {
        presentationSlides[slideCount].text += `${verses[i].verse.toString()}. ${verses[i].text}`
      } else {
        slideCount++
        presentationSlides.push({ slideIndex: slideCount + 1, text: verses[i].text })
      }
    }

    this.bibleService.setCurrentDisplayedBiblePassage(presentationSlides)
  }

  addVerseToPresentation(verse: IBibleVerse) {
    this.bibleService.addToCurrentDisplayedBiblePassage(verse)
  }
}
