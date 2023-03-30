import { Component, OnInit } from '@angular/core';
import { BibleService } from 'src/app/core/services/bible.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { IBiblePassageSlide } from 'src/app/shared/models/bible.model';
import { IFormattedSong, IVerse } from 'src/app/shared/models/song.model';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';

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

  fontSize: number = 16
  lineHeight: number = 130

  constructor(
    private songsService: SongsService,
    private bibleService: BibleService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.fontSize = this.localStorageService.retrieve('fontSize') ? this.localStorageService.retrieve('fontSize') : 16
    this.lineHeight = this.localStorageService.retrieve('lineHeight') ? this.localStorageService.retrieve('lineHeight') : 170

    // Checks if Presentation API is supported by the user's browser
    try {
      // @ts-ignore: Unreachable code error
      this.presentationRequest = new PresentationRequest('/live')
    } catch (error) {
      console.error("Presentation API is not supported")
    }
    this.currentDisplayedSong = this.songsService.getCurrentDisplayedSong() ? this.songsService.getCurrentDisplayedSong() : null
    this.currentDisplayedBiblePassage = this.bibleService.getCurrentDisplayedBiblePassage() ? this.bibleService.getCurrentDisplayedBiblePassage() : null
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
      console.error(err)
      this.isPresentationLive = false
    }
  }

  async getPresentationAvailability() {
    try {
      // Checks for available external displays and availability to start a connection
      const availability = await this.presentationRequest.getAvailability()
      availability.addEventListener('change', () => {
        console.log(availability)
      })
    } catch (error) {
      console.error(error)
      this.isPresentationLive = false
    }
  }

  displayVerse(verse: IVerse) {
    this.currentDisplayedVerse = verse

    // Sends song verses to the receiver if a connection is established
    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify(verse))
    }
  }

  displayPassage(passage: IBiblePassageSlide) {
    this.currentDisplayedPassage = passage

    // Sends song verses to the receiver if a connection is established
    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify(passage))
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

  increaseFontSize() {
    this.manipulateFontSize('addition')
  }

  decreaseFontSize() {
    this.manipulateFontSize('substract')
  }

  manipulateFontSize(typeOfOperation: string) {
    typeOfOperation === 'addition' ? this.fontSize++ : this.fontSize--
    typeOfOperation === 'addition' ? this.lineHeight += 10 : this.lineHeight -= 10
    this.localStorageService.store('fontSize', this.fontSize)
    this.localStorageService.store('lineHeight', this.lineHeight)

    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify({ fontSize: this.fontSize, lineHeight: this.lineHeight }))
    }
  }
}