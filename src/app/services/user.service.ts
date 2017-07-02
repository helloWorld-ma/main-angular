import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {environment} from '../../environments/environment';
import {NotifyService} from 'notify-angular';
import {appCookies} from './cookies';
import {Router} from '@angular/router';
import {User} from '../models/user';
import {WebUtils} from '@tsmean/utils';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

  private user: User;

  constructor(
    private http: Http,
    private notifyService: NotifyService,
    private router: Router
  ) { }

  logIn(email: string, password: string) {
    this.http.post(this.loginApi, {email: email, password: password}).toPromise()
      .then(resp => {
        this.notifyService.success('logged in');
        appCookies.setCookie('username', email);
        this.router.navigate(['/dashboard']);
      })
      .catch(errorResp => {
        this.notifyService.error(errorResp.statusText);
      });
  }

  logOut() {
    appCookies.setUserCookie('');
    this.router.navigate(['/']);
  }

  createUser(user: User, password: string): Promise<any> {
    return this.http.post(this.userApi, {
      user: user,
      password: password
    }).toPromise();
  }

  private get loginApi(): string {
    return WebUtils.urlJoin(environment.api, 'login');
  }

  private get userApi(): string {
    return WebUtils.urlJoin(environment.api, 'users');
  }


}
