import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/index';



@Component({
  selector: 'login',
  styleUrls: [ './login.style.scss' ],
  templateUrl: './login.template.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'login-page app'
  }
})
export class Login implements OnInit {
  model: any = {};
  loading: boolean = false;
  error: string = '';

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
  }

  login() {
    this.loading = true;
    this.error
    this.authenticationService.login(this.model.eMail, this.model.password)
        .subscribe(
            data => {
              this.router.navigate(['/']);
            },
            error => {
              this.error = error; console.log(error);
              this.loading = false;
            });
  }
}