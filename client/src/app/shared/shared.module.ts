import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatSongPipe } from './pipes/format-song.pipe';
import { FormatPlaylistPipe } from './pipes/format-playlist.pipe';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from './material/material/material.module';



@NgModule({
  declarations: [
    FormatSongPipe,
    FormatPlaylistPipe,
    LoginComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    FormatSongPipe,
    FormatPlaylistPipe,
    LoginComponent,
    MaterialModule
  ]
})
export class SharedModule { }
