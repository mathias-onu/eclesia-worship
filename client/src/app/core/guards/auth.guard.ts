import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
// refactoring example: https://stackoverflow.com/questions/75564717/angulars-canactivate-interface-is-deprecated-how-to-replace-it
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(routeSnapshot: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.authService.getToken().subscribe(res => {
        this.localStorageService.store('token', res.body!.access_token)
        this.router.navigateByUrl(routeSnapshot.data['authGuardRedirect'])
      })
      return false
    }

    return true;
  }
}
