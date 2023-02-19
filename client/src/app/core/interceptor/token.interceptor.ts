import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.localStorageService.retrieve('token')}`
      }
    });

    return next.handle(request).pipe(catchError(err => this.handleAuthError(err)))
  }

  handleAuthError(err: HttpErrorResponse): Observable<any> {
    console.error(err)
    if (err.status === 401) {
      this.localStorageService.clear('token')
      this.router.navigateByUrl('/login')

      return of(err.message)
    }
    return throwError(() => new Error(err.message))
  }
}
