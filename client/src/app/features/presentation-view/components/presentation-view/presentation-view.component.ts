import { Component, OnInit } from '@angular/core';
import { IVerse } from 'src/app/shared/models/song.model';

@Component({
  selector: 'app-presentation-view',
  templateUrl: './presentation-view.component.html',
  styleUrls: ['./presentation-view.component.scss']
})
export class PresentationViewComponent implements OnInit {
  currentVerse!: IVerse
  blackScreen: boolean = false;

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
      if (event.data.blackScreen === true) {
        this.blackScreen = true;
      } else {
        this.currentVerse = JSON.parse(event.data)
      }
    })
  }
}
