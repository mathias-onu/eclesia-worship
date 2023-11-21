import { Component, OnInit } from '@angular/core';
import { BibleService } from 'client/app/core/services/bible.service';
import { SongsService } from 'client/app/core/services/songs.service';
import { IBiblePassageSlide } from 'client/app/shared/models/bible.model';
import { IFormattedSong, IVerse } from 'client/app/shared/models/song.model';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { FormControl } from '@angular/forms';
import { AlertService } from 'client/app/shared/services/alert.service';
import { bibleFontSizeOptions, fontSizeOptions } from 'client/app/shared/utils/fontSizeOptions';

@Component({
  selector: 'app-pre-presentation',
  templateUrl: './pre-presentation.component.html',
  styleUrls: ['./pre-presentation.component.scss']
})
export class PrePresentationComponent implements OnInit {
  @LocalStorage('currentDisplayedSong')
  currentDisplayedSong!: IFormattedSong | null | null
  currentDisplayedVerse!: IVerse | null
  @LocalStorage('currentDisplayedBiblePassage')
  currentDisplayedBiblePassage!: IBiblePassageSlide[] | null
  currentDisplayedPassage!: IBiblePassageSlide | null

  presentationRequest!: any
  presentationConnection!: any
  isPresentationLive: boolean = false

  @LocalStorage('songFontSize')
  songFontSize!: number 
  @LocalStorage('bibleFontSize')
  bibleFontSize!: number
  fontSizeOptions: any[] = fontSizeOptions()
  bibleFontSizeOptions: any[] = bibleFontSizeOptions()
  songFontSizeInput = new FormControl()
  bibleFontSizeInput = new FormControl()

  constructor(
    private songsService: SongsService,
    private bibleService: BibleService,
    private localStorageService: LocalStorageService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    if(this.localStorageService.retrieve('songFontSize')) {
      this.songFontSizeInput.setValue(this.songFontSize)
    } else {
      this.songFontSizeInput.setValue(64)
    }

    if(this.localStorageService.retrieve('bibleFontSize')) {
      this.bibleFontSizeInput.setValue(this.bibleFontSize)
    } else {
      this.bibleFontSizeInput.setValue(41)
    }

    // Checks if Presentation API is supported by the user's browser
    try {
      // @ts-ignore: Unreachable code error
      this.presentationRequest = new PresentationRequest('/live')
    } catch (error) {
      this.alertService.openSnackBar("Sorry but the browser you are using cannot present to a secondary screen... Use Chrome instead (or a chromium based browser).", 'error')
    }
    this.currentDisplayedSong = this.songsService.getCurrentDisplayedSong() ? this.songsService.getCurrentDisplayedSong() : null
    this.currentDisplayedBiblePassage = this.bibleService.getCurrentDisplayedBiblePassage() ? this.bibleService.getCurrentDisplayedBiblePassage() : null

    this.songFontSizeInput.valueChanges.subscribe((value) => {
      this.songFontSize = Number(value)
      this.localStorageService.store('songFontSize', this.songFontSize)
      if (this.presentationConnection) {
        this.presentationConnection.send(
          JSON.stringify(
            {
              text: this.currentDisplayedVerse,
              songFontSize: this.songFontSize
            }
          )
        )
      }
    })

    this.bibleFontSizeInput.valueChanges.subscribe((value) => {
      this.bibleFontSize = Number(value)
      if (this.presentationConnection) {
        this.localStorageService.store('bibleFontSize', this.bibleFontSize)
        this.presentationConnection.send(
          JSON.stringify(
            {
              text: this.currentDisplayedPassage,
              bibleFontSize: this.bibleFontSize
            }
          )
        )
      }
    })
  }

  async startPresentation() {
    // Terminates existing presentation connections (if any)
    this.terminatePresentation()

    // Checks for available external displays and availability to start a connection
    this.getPresentationAvailability()
    this.isPresentationLive = true

    try {
      // Starts a presentation connection and displaying to the selected external display
      const connection = await this.presentationRequest.start()
      this.presentationConnection = connection
    } catch (err) {
      this.isPresentationLive = false
    }
  }

  async getPresentationAvailability() {
    try {
      // Checks for available external displays and availability to start a connection
      await this.presentationRequest.getAvailability()
    } catch (error) {
      this.isPresentationLive = false
    }
  }

  displayVerse(verse: IVerse) {
    this.currentDisplayedVerse = verse
    this.currentDisplayedPassage = null

    // Sends song verses to the receiver if a connection is established
    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify({ text: verse, songFontSize: this.songFontSize }))
    }
  }

  displayPassage(passage: IBiblePassageSlide) {
    this.currentDisplayedPassage = passage
    this.currentDisplayedVerse = null

    // Sends song verses to the receiver if a connection is established
    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify({ text: passage, bibleFontSize: this.bibleFontSize }))
    }
  }

  terminatePresentation() {
    // Terminates the presentation onto the receiver (chrome instance on the secondary display)
    if (this.presentationConnection) {
      this.presentationConnection.terminate()
    }
    this.presentationConnection = null
    this.isPresentationLive = false
    this.currentDisplayedVerse = null
    this.currentDisplayedPassage = null
  }

  setBlackScreen() {
    this.currentDisplayedVerse = null
    this.currentDisplayedPassage = null

    // Makes the text on the second text disappear
    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify({ blackScreen: true }))
    }
  }

  removePresentationItem() {
    this.localStorageService.clear('currentDisplayedSong')
    this.localStorageService.clear('currentDisplayedBiblePassage')
    this.currentDisplayedVerse = null
    this.currentDisplayedPassage = null
  }

  // increaseFontSize() {
  //   this.manipulateFontSize('addition')
  // }

  // decreaseFontSize() {
  //   this.manipulateFontSize('substract')
  // }
  // 
  // manipulateFontSize(typeOfOperation: string) {
  //   if (this.currentDisplayedSong) {
  //     typeOfOperation === 'addition' ? this.songFontSize++ : this.songFontSize--
  //     this.localStorageService.store('songFontSize', this.songFontSize)
  //     this.songFontSizeInput.setValue(this.songFontSize)
  //   } else {
  //     typeOfOperation === 'addition' ? this.bibleFontSize++ : this.bibleFontSize--
  //     this.localStorageService.store('bibleFontSize', this.bibleFontSize)
  //     this.songFontSizeInput.setValue(this.bibleFontSize)
  //   }

  //   if (this.presentationConnection) {
  //     if (this.currentDisplayedSong) {
  //       this.presentationConnection.send(
  //         JSON.stringify(
  //           {
  //             text: this.currentDisplayedVerse,
  //             songFontSize: this.songFontSize
  //           }
  //         )
  //       )
  //     } else if (this.currentDisplayedBiblePassage) {
  //       JSON.stringify(
  //         {
  //           text: this.currentDisplayedPassage,
  //           bibleFontSize: this.bibleFontSize
  //         }
  //       )
  //     }
  //   }
  // }
}
