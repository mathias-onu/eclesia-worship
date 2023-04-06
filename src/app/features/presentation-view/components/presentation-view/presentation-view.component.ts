import { Component, OnInit } from '@angular/core';
import { IBiblePassageSlide } from 'src/app/shared/models/bible.model';
import { IVerse } from 'src/app/shared/models/song.model';

@Component({
  selector: 'app-presentation-view',
  templateUrl: './presentation-view.component.html',
  styleUrls: ['./presentation-view.component.scss']
})
export class PresentationViewComponent implements OnInit {
  currentVerse!: IVerse | null
  currentBiblePassage!: IBiblePassageSlide | null
  blackScreen: boolean = false
  fontSize: number = 35
  lineHeight: number = this.fontSize / 2

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
      if (parsedData?.text?.verseIndex) {  // Gets the song verses and modifies the font size
        this.blackScreen = false
        this.currentBiblePassage = null
        this.currentVerse = parsedData.text
        this.fontSize = parsedData.fontSize
        this.lineHeight = this.fontSize / 2
        if (this.fontSize >= 40) {
          this.lineHeight = 35
        }
      } else if (parsedData?.text?.text) {  // Gets the Bible text and modifies the font size
        this.blackScreen = false
        this.currentVerse = null
        this.currentBiblePassage = parsedData.text
        this.fontSize = parsedData.fontSize
        this.lineHeight = 65
      } else if (parsedData?.blackScreen) {  // Sets the screen to black
        this.blackScreen = true
      }
    })
  }
}
