import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { IBiblePassageSlide, IBibleVerse } from 'client/app/shared/models/bible.model';
import { environment } from 'client/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BibleService {
  resourceUrl: string = environment.apiUrl
  @LocalStorage('currentDisplayedBiblePassage')
  currentDisplayedBiblePassage!: IBiblePassageSlide[]

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  getBiblePassage(passage: string | null): Observable<HttpResponse<IBibleVerse[]>> {
    return this.http.get<IBibleVerse[]>(`${this.resourceUrl}/local-bible?passage=${passage}`, { observe: 'response'})
  }

  getCurrentDisplayedBiblePassage() {
    return this.currentDisplayedBiblePassage
  }

  setCurrentDisplayedBiblePassage(passage: IBiblePassageSlide[]) {
    this.localStorageService.store('currentDisplayedSong', null)
    this.currentDisplayedBiblePassage = passage
    this.localStorageService.store('currentDisplayedBiblePassage', passage)
  }

  addToCurrentDisplayedBiblePassage(verse: IBibleVerse) {
    this.localStorageService.store('currentDisplayedSong', null)

    if (this.currentDisplayedBiblePassage) {
      const lastSlidePassage = this.currentDisplayedBiblePassage[this.currentDisplayedBiblePassage.length - 1]

      if (!this.currentDisplayedBiblePassage.some(slide => slide.text.includes(verse.text)) && this.currentDisplayedBiblePassage.length > 0 && verse.text.length + lastSlidePassage.text.length < 500) {
        lastSlidePassage.text += ` ${verse.number.toString()}. ${verse.text}`
      } else {
        if (!this.currentDisplayedBiblePassage.some(slide => slide.text.includes(verse.text))) {
          this.currentDisplayedBiblePassage.push({ slideIndex: this.currentDisplayedBiblePassage.length, text: ` ${verse.number.toString()}. ${verse.text}` })
        }
      }
    } else {
      this.currentDisplayedBiblePassage = [{ slideIndex: 1, text: ` ${verse.number.toString()}. ${verse.text}` }]
    }

    this.localStorageService.store('currentDisplayedBiblePassage', this.currentDisplayedBiblePassage)
  }
}
