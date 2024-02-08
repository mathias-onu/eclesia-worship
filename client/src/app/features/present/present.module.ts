import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentRoutingModule } from './present-routing.module';
import { ControllerComponent } from './components/controller/controller.component';
import { ReceiverComponent } from './components/receiver/receiver.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    ControllerComponent,
    ReceiverComponent
  ],
  imports: [
    CommonModule,
    PresentRoutingModule,
    SharedModule
  ]
})
export class PresentModule { }
