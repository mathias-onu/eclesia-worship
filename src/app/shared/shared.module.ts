import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatSongPipe } from './pipes/format-song.pipe';
import { FormatPlaylistPipe } from './pipes/format-playlist.pipe';
import { MaterialModule } from './material/material/material.module';



@NgModule({
  declarations: [
    FormatSongPipe,
    FormatPlaylistPipe
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    FormatSongPipe,
    FormatPlaylistPipe,
    MaterialModule
  ]
})
export class SharedModule { }
