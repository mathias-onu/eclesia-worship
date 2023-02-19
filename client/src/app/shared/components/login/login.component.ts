import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  login() {
    this.localStorageService.clear('token')

    this.authService.getToken().subscribe(res => {
      this.localStorageService.store('token', res.body!.access_token)
      this.router.navigateByUrl('/home')
    })
  }
}
