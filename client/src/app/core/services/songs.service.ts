import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorage, LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { IFormattedCompletePlaylist, IPlaylist } from 'src/app/shared/models/playlist.model';
import { IFormattedSong, ISong } from 'src/app/shared/models/song.model';
import { FormatSongPipe } from 'src/app/shared/pipes/format-song.pipe';
import { environment } from 'src/environments/environment.dev';
import * as moment from 'moment';
import { IBibleReference } from 'src/app/shared/models/bible.model';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  resourceUrl: string = environment.apiUrl
  @LocalStorage('currentPlaylist')
  currentPlaylist!: IFormattedCompletePlaylist
  @LocalStorage('currentDisplayedSong')
  currentDisplayedSong!: IFormattedSong
  @LocalStorage('currentDisplayedBiblePassage')
  currentDisplayedBiblePassage!: IFormattedSong

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private formatSong: FormatSongPipe
  ) { }

  getSongs(limit?: number, search?: string | null): Observable<HttpResponse<ISong[]>> {
    return this.http.get<ISong[]>(`${this.resourceUrl}/songs${search ? `?search=${search}` : ''}${limit ? `?limit=${limit}` : ''}`, { observe: 'response' })
  }

  getSong(id: string): Observable<HttpResponse<ISong>> {
    return this.http.get<ISong>(`${this.resourceUrl}/songs/${id}`, { observe: 'response' })
  }

  syncSongs(): Observable<HttpResponse<ISong[]>> {
    return this.http.post<any>(this.resourceUrl + '/sync/songs', {}, { observe: 'response' })
  }

  getPlaylists(limit?: number, search?: string | null): Observable<HttpResponse<IPlaylist[]>> {
    return this.http.get<IPlaylist[]>(`${this.resourceUrl}/playlists${search ? `?search=${search}` : ''}${limit ? `?limit=${limit}` : ''}`, { observe: 'response' })
  }

  getPlaylist(id: string): Observable<HttpResponse<IPlaylist>> {
    return this.http.get<IPlaylist>(`${this.resourceUrl}/playlists/${id}`, { observe: 'response' })
  }

  syncPlaylists(): Observable<HttpResponse<IPlaylist[]>> {
    return this.http.post<any>(this.resourceUrl + '/sync/playlists', {}, { observe: 'response' })
  }

  getBible(passage: string | null): Observable<HttpResponse<IBibleReference>> {
    return this.http.get<IBibleReference>(`${this.resourceUrl}/bible?passage=${passage}`, { observe: 'response' })
  }

  getFormattedCompletePlaylist() {
    return this.currentPlaylist
  }

  setFormattedCompletePlaylist(playlist: any) {
    this.localStorageService.store('currentPlaylist', playlist)
  }

  addSongToPlaylist(song: ISong) {
    const formattedSong = this.formatSong.transform(song)
    if (this.currentPlaylist !== null) {
      this.currentPlaylist.songs.push(this.formatSong.transform(song))
    } else {
      this.currentPlaylist = {
        date: moment().format("YYYY-MM-DD"),
        songs: Array()
      }
      this.currentPlaylist.songs.push(formattedSong)
    }
    this.localStorageService.store('currentPlaylist', this.currentPlaylist)
  }

  getCurrentDisplayedSong() {
    return this.currentDisplayedSong
  }

  setCurrentDisplayedSong(song: IFormattedSong) {
    this.currentDisplayedSong = song
    this.localStorageService.store('currentDisplayedSong', song)
  }
}
