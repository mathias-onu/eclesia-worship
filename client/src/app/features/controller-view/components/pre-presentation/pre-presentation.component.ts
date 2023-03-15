import { Component, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';
import { SongsService } from 'src/app/core/services/songs.service';
import { IFormattedSong, IVerse } from 'src/app/shared/models/song.model';

@Component({
  selector: 'app-pre-presentation',
  templateUrl: './pre-presentation.component.html',
  styleUrls: ['./pre-presentation.component.scss']
})
export class PrePresentationComponent implements OnInit {
  @LocalStorage('currentDisplayedSong')
  currentDisplayedSong!: IFormattedSong
  currentDisplayedVerse!: IVerse | null

  // @ts-ignore: Unreachable code error
  presentationRequest = new PresentationRequest('/live')
  presentationConnection!: any
  isPresentationLive: boolean = false

  constructor(
    private songsService: SongsService
  ) { }

  ngOnInit(): void {
    this.currentDisplayedSong = this.songsService.getCurrentDisplayedSong()
  }

  async getPresentationAvailability() {
    try {
      const availability = await this.presentationRequest.getAvailability()
      availability.addEventListener('change', () => {
        console.log(availability)
      })
    } catch (error) {
      console.error(error)
      this.isPresentationLive = false
    }
  }

  async startPresentation() {
    this.terminatePresentation()
    this.isPresentationLive = true
    this.getPresentationAvailability()

    try {
      const connection = await this.presentationRequest.start()
      this.presentationConnection = connection
    } catch (err) {
      console.error(err)
      this.isPresentationLive = false
    }
  }

  displayVerse(verse: IVerse) {
    this.currentDisplayedVerse = verse
    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify(verse))
    }
    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify(verse))
    }
  }

  terminatePresentation() {
    if (this.presentationConnection) {
      this.presentationConnection.terminate()
    }
    this.presentationConnection = null
    this.isPresentationLive = false
    this.currentDisplayedVerse = null
  }

  setBlackScreen() {
    if (this.presentationConnection) {
      this.presentationConnection.send(JSON.stringify({ blackScreen: true }))
    }
  }
}
