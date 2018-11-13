import { Component, OnInit }                from '@angular/core';

import { Platform }                         from '@ionic/angular';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

import { Observable }                       from 'rxjs';


import { environment }                      from '@environments/environment.prod';
import { AuthService }                      from '@app-services/auth/auth.service';
import { User }                             from '@app-interfaces/coffee-user';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  user$: Observable<User>;

  bannerConfig: AdMobFreeBannerConfig = {
    isTesting: false,
    autoShow: true,
    id: environment.admobAppID,
    bannerAtTop: false
  };


  constructor(private admob: AdMobFree,
              private auth: AuthService, 
              private platform: Platform) {}

  public async ngOnInit(): Promise<void> {
    try {
      this.user$ = this.auth.user$;

      this.admob.banner.config(this.bannerConfig);

      await this.admob.banner.prepare();
      console.log('banner ready');
    }
    catch(e) { console.log('OnInit error: ', e) }
  }

  public async googleLogin() {
    try {
      if (this.platform.is('cordova')) {
        const user = await this.auth.googleLogin();
        console.log({ user });
      }
    }
    catch(e) { console.log('googleLogin() error: ', e) }
  }
}
