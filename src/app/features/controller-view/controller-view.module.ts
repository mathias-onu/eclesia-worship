import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControllerViewComponent } from './components/controller-view/controller-view.component';
import { ControllerViewRoutingModule } from './controller-view-routing.module';
import { FormsModule } from '@angular/forms';
import { SongsComponent } from './components/songs/songs.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { PlaylistSearchDialogComponent } from './components/playlist-search-dialog/playlist-search-dialog.component';
import { PrePresentationComponent } from './components/pre-presentation/pre-presentation.component';
import { BibleBooksDialogComponent } from './components/bible-books-dialog/bible-books-dialog.component';


@NgModule({
  declarations: [
    ControllerViewComponent,
    SongsComponent,
    PlaylistComponent,
    PlaylistSearchDialogComponent,
    PrePresentationComponent,
    BibleBooksDialogComponent
  ],
  imports: [
    CommonModule,
    ControllerViewRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ControllerViewModule { }
