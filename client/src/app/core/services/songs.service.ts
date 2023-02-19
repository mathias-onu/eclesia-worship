import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlaylist } from 'src/app/shared/models/playlist.model';
import { ISong } from 'src/app/shared/models/song.model';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  resourceUrl: string = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  getSongs(limit?: number, search?: string): Observable<HttpResponse<ISong[]>> {
    return this.http.get<ISong[]>(`${this.resourceUrl}/songs${search ? `?search=${search}` : ''}${limit ? `?limit=${limit}` : ''}`, { observe: 'response' })
  }

  getSong(id: string): Observable<HttpResponse<ISong>> {
    return this.http.get<ISong>(`${this.resourceUrl}/songs/${id}`, { observe: 'response' })
  }

  syncSongs(): Observable<HttpResponse<ISong[]>> {
    return this.http.post<any>(this.resourceUrl + '/sync/songs', {}, { observe: 'response' })
  }

  getPlaylists(): Observable<HttpResponse<IPlaylist[]>> {
    return this.http.get<IPlaylist[]>(this.resourceUrl + '/playlists', { observe: 'response' })
  }

  getPlaylist(id: string): Observable<HttpResponse<IPlaylist>> {
    return this.http.get<IPlaylist>(`${this.resourceUrl}/playlists/${id}`, { observe: 'response' })
  }

  syncPlaylists(): Observable<HttpResponse<IPlaylist[]>> {
    return this.http.post<any>(this.resourceUrl + '/sync/playlists', {}, { observe: 'response' })
  }
}
