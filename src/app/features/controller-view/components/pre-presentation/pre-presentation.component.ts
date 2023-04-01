import { Component, OnInit } from '@angular/core';
import { BibleService } from 'src/app/core/services/bible.service';
import { SongsService } from 'src/app/core/services/songs.service';
import { IBiblePassageSlide } from 'src/app/shared/models/bible.model';
import { IFormattedSong, IVerse } from 'src/app/shared/models/song.model';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { FormControl } from '@angular/forms';

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
  @LocalStorage('fontSize')
  fontSize: number = 35
  fontSizeOptions: any[] = [{ value: 20, viewValue: '20px' }, { value: 25, viewValue: '25px' }, { value: 30, viewValue: '30px' }, { value: 35, viewValue: '35px' }, { value: 40, viewValue: '40px' }, { value: 45, viewValue: '45px' }, { value: 50, viewValue: '50px' }, { value: 60, viewValue: '60px' }, { value: 65, viewValue: '65px' }]
  fontSizeInput = new FormControl()

  constructor(
    private songsService: SongsService,
    private bibleService: BibleService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.fontSize = this.localStorageService.retrieve('fontSize') ? this.localStorageService.retrieve('fontSize') : 35

    // Checks if Presentation API is supported by the user's browser
    try {
      // @ts-ignore: Unreachable code error
      this.presentationRequest = new PresentationRequest('/live')
    } catch (error) {
      console.error("Presentation API is not supported")
    }
    this.currentDisplayedSong = this.songsService.getCurrentDisplayedSong() ? this.songsService.getCurrentDisplayedSong() : null
    this.currentDisplayedBiblePassage = this.bibleService.getCurrentDisplayedBiblePassage() ? this.bibleService.getCurrentDisplayedBiblePassage() : null

    this.fontSizeInput.valueChanges.subscribe((value: number) => {
      if (this.presentationConnection) {
        this.presentationConnection.send(JSON.stringify({ text: this.currentDisplayedVerse ? this.currentDisplayedVerse : this.currentDisplayedPassage, fontSize: value }))
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
    this.currentDisplayedPassage = null

    // Sends song verses to the receiver if a connection is established
    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify({ text: verse, fontSize: this.fontSize }))
    }
  }

  displayPassage(passage: IBiblePassageSlide) {
    this.currentDisplayedPassage = passage
    this.currentDisplayedVerse = null

    // Sends song verses to the receiver if a connection is established
    if (this.presentationConnection) {
      console.log(passage)
      this.presentationConnection.send(JSON.stringify({ text: passage, fontSize: this.fontSize }))
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
    this.localStorageService.store('fontSize', this.fontSize)

    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify({ text: this.currentDisplayedVerse ? this.currentDisplayedVerse : this.currentDisplayedPassage, fontSize: this.fontSize }))
    }
  }
}
