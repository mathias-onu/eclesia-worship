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
  fontSize: number = 16
  lineHeight: number = 150

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

      if (parsedData.verse) {  // Gets the song verses
        this.blackScreen = false
        this.currentBiblePassage = null
        this.currentVerse = parsedData
      } else if (parsedData.text) {  // Gets the Bible text
        this.blackScreen = false
        this.currentVerse = null
        this.currentBiblePassage = parsedData
      } else if (parsedData.blackScreen) {  // Sets the screen to black
        this.blackScreen = true
      } else if (parsedData.fontSize) {  // Modifies the font size
        this.fontSize = parsedData.fontSize
        this.lineHeight = parsedData.textLineHeight
      }
    })
  }
}
