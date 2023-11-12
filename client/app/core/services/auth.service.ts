import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'client/environments/environment';
import { LocalStorageService } from 'ngx-webstorage';
import { IToken } from 'client/app/shared/models/token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  resourceUrl: string = environment.apiUrl

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) { }

  getToken(): Observable<HttpResponse<IToken>> {
    return this.http.post<any>(this.resourceUrl + '/refresh-token', {}, { observe: 'response' })
  }

  isAuthenticated(): boolean {
    return !!this.localStorageService.retrieve('token')
  }

  checkAuthenticationState() {
    if (!this.isAuthenticated()) {
      this.getToken().subscribe(res => {
        this.localStorageService.store('token', res.body!.access_token)
      })
    }
  }
}
