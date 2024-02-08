import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrl: './authorize.component.scss'
})
export class AuthorizeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.localStorageService.clear('token')
    this.authService.getToken().subscribe(res => {
      this.localStorageService.store('token', res.body!.access_token)
      this.router.navigateByUrl('/home')
    })
  }
}
