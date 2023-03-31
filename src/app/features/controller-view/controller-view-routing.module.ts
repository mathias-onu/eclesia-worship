import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControllerViewComponent } from './components/controller-view/controller-view.component';

const routes: Routes = [
    { path: '', component: ControllerViewComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ControllerViewRoutingModule { }
