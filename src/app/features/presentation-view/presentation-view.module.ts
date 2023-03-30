import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentationViewRoutingModule } from './presentation-view-routing.module';
import { PresentationViewComponent } from './components/presentation-view/presentation-view.component';


@NgModule({
  declarations: [
    PresentationViewComponent
  ],
  imports: [
    CommonModule,
    PresentationViewRoutingModule
  ]
})
export class PresentationViewModule { }
