import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./features/controller-view/controller-view.module').then(m => m.ControllerViewModule), canActivate: [AuthGuard], data: { authGuardRedirect: '/home' } },
  { path: 'live', loadChildren: () => import('./features/presentation-view/presentation-view.module').then(m => m.PresentationViewModule), canActivate: [AuthGuard], data: { authGuardRedirect: '/live' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
