import { Component, OnInit }                from '@angular/core';

import { Platform }                         from '@ionic/angular';

import { Observable }                       from 'rxjs';

import { AuthService }                      from '@app-services/auth/auth.service';
import { User }                             from '@app-interfaces/coffee-user';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  user$: Observable<User>;

  constructor(private auth: AuthService, private platform: Platform) {}

  public async ngOnInit(): Promise<void> { 
    this.user$ = this.auth.user$;
  }

  public async googleLogin(): Promise<void> {
    try {
      if (this.platform.is('cordova')) {
        const user = await this.auth.googleLogin();
        console.log({ user });
      }
    }
    catch(e) { console.log('googleLogin() error: ', e) }
  }

}
