import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainViewComponent } from './components/main-view/main-view.component';
import { MainViewRoutingModule } from './main-view-routing.module';



@NgModule({
  declarations: [
    MainViewComponent
  ],
  imports: [
    CommonModule,
    MainViewRoutingModule
  ]
})
export class MainViewModule { }
