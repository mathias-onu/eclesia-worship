import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainViewComponent } from './components/main-view/main-view.component';
import { MainViewRoutingModule } from './main-view-routing.module';
import { SongsComponent } from './components/songs/songs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { PlaylistSearchDialogComponent } from './components/playlist-search-dialog/playlist-search-dialog.component';


@NgModule({
  declarations: [
    MainViewComponent,
    SongsComponent,
    PlaylistComponent,
    PlaylistSearchDialogComponent
  ],
  imports: [
    CommonModule,
    MainViewRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class MainViewModule { }
