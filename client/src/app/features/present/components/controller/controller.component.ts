import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { SplitterResizeEndEvent } from 'primeng/splitter';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrl: './controller.component.scss'
})
export class ControllerComponent implements OnInit {
  panel1Size: number = 30
  panel2Size: number = 70

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.panel1Size = this.localStorageService.retrieve('panel1Size')
    this.panel2Size = this.localStorageService.retrieve('panel2Size')
  }

  splitterChange(event: SplitterResizeEndEvent) {
    this.localStorageService.store('panel1Size', event.sizes[0])
    this.localStorageService.store('panel2Size', event.sizes[1])
  }
}
