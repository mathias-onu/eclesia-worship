import { Component, OnInit } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';
import { SongsService } from 'src/app/core/services/songs.service';
import { IFormattedSong, IVerse } from 'src/app/shared/models/song.model';

@Component({
  selector: 'app-pre-presentation',
  templateUrl: './pre-presentation.component.html',
  styleUrls: ['./pre-presentation.component.scss']
})
export class PrePresentationComponent implements OnInit {
  @LocalStorage('currentDisplayedSong')
  currentDisplayedSong!: IFormattedSong
  currentDisplayedVerse!: IVerse | null

  constructor(
    private songsService: SongsService
  ) { }

  ngOnInit(): void {
    this.currentDisplayedSong = this.songsService.getCurrentDisplayedSong()
  }

  displayVerse(verse: IVerse) {
    this.currentDisplayedVerse = verse
  }

  endPresentation() {
    this.currentDisplayedVerse = null;
  }
}
