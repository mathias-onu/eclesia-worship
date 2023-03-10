import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.authService.getToken().subscribe(res => {
        this.localStorageService.store('token', res.body!.access_token)
        this.router.navigateByUrl('/home')
      })
      return false
    }

    return true;
  }
}
