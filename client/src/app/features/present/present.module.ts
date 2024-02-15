import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PresentRoutingModule } from './present-routing.module';
import { ControllerComponent } from './components/controller/controller.component';
import { ReceiverComponent } from './components/receiver/receiver.component';
import { SharedModule } from '../../shared/shared.module';
import { SongsBibleTabsComponent } from './components/songs-bible-tabs/songs-bible-tabs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BibleBooksDialogComponent } from './components/bible-books-dialog/bible-books-dialog.component';
import { PlaylistComponent } from './components/playlist/playlist.component';


@NgModule({
  declarations: [
    ControllerComponent,
    ReceiverComponent,
    SongsBibleTabsComponent,
    BibleBooksDialogComponent,
    PlaylistComponent
  ],
  imports: [
    CommonModule,
    PresentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PresentModule { }
