import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BibleService } from 'client/app/core/services/bible.service';
import { SongsService } from 'client/app/core/services/songs.service';
import { IBiblePassageSlide, IBibleVerse } from 'client/app/shared/models/bible.model';
import { ISong } from 'client/app/shared/models/song.model';
import { AlertService } from 'client/app/shared/services/alert.service';
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
  loadingSongs: boolean = false
  searchBibleInput = new FormControl('')
  loadingPassage: boolean = false
  syncLoading: boolean = false

  searchedBiblePassage!: IBibleVerse[] | null

  constructor(
    private songsService: SongsService,
    private bibleService: BibleService,
    private dialog: MatDialog,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadingSongs = true
    this.getSongs(15)

    this.searchSongInput.valueChanges.subscribe(res => {
      if (res === '') {
        this.loadingSongs = true
        this.getSongs(15)
      }
    })

    this.searchBibleInput.valueChanges.subscribe(passage => {
      if (passage === '') {
        this.loadingSongs = false
        this.searchedBiblePassage = null
      }
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

  searchSong() {
    this.loadingSongs = true
    this.getSongs(undefined, this.searchSongInput.value)
  }

  searchBiblePassage() {
    this.bibleService.getBiblePassage(this.searchBibleInput.value).subscribe({
      next: (res) => {
        this.loadingPassage = false
        this.searchedBiblePassage = res.body
      },
      error: () => {
        this.loadingPassage = false
        this.alertService.openSnackBar('There is an error with your Bible search...', 'error')
      }
    })
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
        this.searchBiblePassage()
      }
    })
  }

  addPassageToPresentation() {
    const verses = this.searchedBiblePassage!
    const presentationSlides: IBiblePassageSlide[] = [{ slideIndex: 1, text: "" }]
    let slideCount = 0

    for (let i = 0; i < verses.length; i++) {
      if (presentationSlides[slideCount].text.length < 500) {
        presentationSlides[slideCount].text += ` ${verses[i].number.toString()}. ${verses[i].text}`
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

  getSongs(limit?: number, searchValue?: string | null) {
    this.songsService.getSongs(limit ? limit : undefined, searchValue ? searchValue : undefined).subscribe({
      next: res => {
        if (res.body!.length === 0) {
          this.alertService.openSnackBar("Sorry, but there was an error while getting the songs... Please try again later...", 'error')
          this.syncSongs()
        } else {
          this.songs = res.body
        }
        this.loadingSongs = false
      },
      error: err => {
        this.alertService.openSnackBar(err.message, 'error')
        this.loadingSongs = false
      }
    })
  }
}
