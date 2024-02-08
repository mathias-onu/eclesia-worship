import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrl: './controller.component.scss',
  providers: [MessageService]
})
export class ControllerComponent implements OnInit {

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    
  }

  sync() {
    console.log('something')
    this.messageService.add({ severity: 'info', summary: 'Songs sync completed' })
  }
}
