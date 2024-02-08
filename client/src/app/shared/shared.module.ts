import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from './primeng/primeng.module';
import { FormatPlaylistPipe } from './pipes/format-playlist.pipe';
import { FormatSongPipe } from './pipes/format-song.pipe';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    FormatPlaylistPipe,
    FormatSongPipe,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PrimengModule
  ],
  exports: [
    PrimengModule
  ]
})
export class SharedModule { }
