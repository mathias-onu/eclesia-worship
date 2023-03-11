import { Component, OnInit } from '@angular/core';
import { IVerse } from 'src/app/shared/models/song.model';

@Component({
  selector: 'app-presentation-view',
  templateUrl: './presentation-view.component.html',
  styleUrls: ['./presentation-view.component.scss']
})
export class PresentationViewComponent implements OnInit {
  currentVerse!: IVerse

  constructor() { }

  ngOnInit(): void {
    this.getConnection()
  }

  async getConnection() {
    try {
      // @ts-ignore: Unreachable code error
      const connectionList = await navigator.presentation.receiver.connectionList
      this.addConnection(connectionList.connections[0])
    } catch (err) {
      console.error(err)
    }
  }

  addConnection(connection: any) {
    connection.addEventListener('message', (event: any) => {
      console.log(JSON.parse(event.data))
      this.currentVerse = JSON.parse(event.data)
      connection.send('Hey controller! I just received a message.')
    })
  }
}
