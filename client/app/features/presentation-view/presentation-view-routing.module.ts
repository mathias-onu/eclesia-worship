import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentationViewComponent } from './components/presentation-view/presentation-view.component';

const routes: Routes = [
  { path: '', component: PresentationViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresentationViewRoutingModule { }
