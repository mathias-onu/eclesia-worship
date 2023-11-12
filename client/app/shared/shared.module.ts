import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatSongPipe } from './pipes/format-song.pipe';
import { FormatPlaylistPipe } from './pipes/format-playlist.pipe';
import { MaterialModule } from './material/material/material.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    FormatSongPipe,
    FormatPlaylistPipe,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    FormatSongPipe,
    FormatPlaylistPipe,
    MaterialModule
  ]
})
export class SharedModule { }
