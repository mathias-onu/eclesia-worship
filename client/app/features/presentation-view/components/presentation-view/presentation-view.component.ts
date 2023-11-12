import { Component, OnInit } from '@angular/core';
import { IBiblePassageSlide } from 'client/app/shared/models/bible.model';
import { IVerse } from 'client/app/shared/models/song.model';

@Component({
  selector: 'app-presentation-view',
  templateUrl: './presentation-view.component.html',
  styleUrls: ['./presentation-view.component.scss']
})
export class PresentationViewComponent implements OnInit {
  currentVerse!: IVerse | null
  currentBiblePassage!: IBiblePassageSlide | null
  blackScreen: boolean = false
  songFontSize: number = 35
  bibleFontSize: number = 41

  constructor() { }

  ngOnInit(): void {
    this.getConnection()
  }

  async getConnection() {
    try {
      // Checks for available connections and connects with the controller (selecting the first connection)
      // @ts-ignore: Unreachable code error
      const connectionList = await navigator.presentation.receiver.connectionList
      this.receiveMessage(connectionList.connections[0])
    } catch (err) {
      console.error(err)
    }
  }

  receiveMessage(connection: any) {
    // Receives data from the controller
    connection.addEventListener('message', (event: any) => {
      const parsedData = JSON.parse(event.data)
      console.log(parsedData)
      if (parsedData?.text?.verseIndex) {  // Gets the song verses and modifies the font size
        this.blackScreen = false
        this.currentBiblePassage = null
        this.currentVerse = parsedData.text
        this.songFontSize = parsedData.songFontSize
      } else if (parsedData?.text?.text) {  // Gets the Bible text and modifies the font size
        this.blackScreen = false
        this.currentVerse = null
        this.currentBiblePassage = parsedData.text
        this.bibleFontSize = parsedData.bibleFontSize
        console.log(this.bibleFontSize)
      } else if (parsedData?.blackScreen) {  // Sets the screen to black
        this.blackScreen = true
      }
    })
  }
}
