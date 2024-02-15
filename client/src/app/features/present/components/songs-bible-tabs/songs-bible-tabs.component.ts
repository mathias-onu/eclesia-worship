import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BibleService } from '../../../../core/services/bible.service';
import { SongsService } from '../../../../core/services/songs.service';
import { IBibleVerse, IBiblePassageSlide } from '../../../../shared/models/bible.model';
import { ISong } from '../../../../shared/models/song.model';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BibleBooksDialogComponent } from '../bible-books-dialog/bible-books-dialog.component';

@Component({
  selector: 'app-songs-bible-tabs',
  templateUrl: './songs-bible-tabs.component.html',
  styleUrl: './songs-bible-tabs.component.scss'
})
export class SongsBibleTabsComponent implements OnInit {
  searchSongInput = new FormControl('')
  songs!: ISong[] | null
  numberOfRequestedSongs: number = 30
  loadingSongs: boolean = false
  searchBibleInput = new FormControl('')
  loadingPassage: boolean = false
  syncLoading: boolean = false

  searchedBiblePassage!: IBibleVerse[] | null

  ref: DynamicDialogRef | undefined;

  constructor(
    private songsService: SongsService,
    private bibleService: BibleService,
    private dialogService: DialogService,
    private messageService: MessageService
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There is an error with your Bible search...' });
      }
    })
  }

  syncSongs() {
    this.syncLoading = true
    this.songsService.syncSongs().subscribe({
      next: (res) => {
        this.songs = res.body
        this.syncLoading = false
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Songs have been synced successfully!' });
      },
      error: () => {
        this.syncLoading = false
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while syncing songs...' });
      }
    })
  }

  openBibleBooksDialog() {
    this.ref = this.dialogService.open(BibleBooksDialogComponent, { 
      width: '50%',
      height: '90%'
    })

    this.ref.onClose.subscribe(passage => {
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
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error while getting the songs. Please try again later...' });
        } else {
          this.songs = res.body
        }
        this.loadingSongs = false
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `${err.message}` });
        this.loadingSongs = false
      }
    })
  }}
