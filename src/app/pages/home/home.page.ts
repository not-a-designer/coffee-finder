import { Component, OnInit }                from '@angular/core';

import { Platform }                         from '@ionic/angular';

import { Observable }                       from 'rxjs';

import { AuthService }                      from '@app-services/auth/auth.service';
import { RssFeedService }                   from '@app-services/rss-feed/rss-feed.service';
import { CoffeeUser }                       from '@app-interfaces/coffee-user';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  user$: Observable<CoffeeUser>;
  sprudgeUrl: string = 'http://sprudge.com/feed';

  newsList: Array<any>;

  constructor(private auth: AuthService, private platform: Platform, private rssFeed: RssFeedService,) {}

  public async ngOnInit(): Promise<void> { 
    try {
      this.user$ = this.auth.user$;
      await this.getFeed(this.sprudgeUrl);
      console.log(this.newsList.length);
    }
    catch(e) { console.log(e) }
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

  public async getFeed(url: string) {
    try {
      const feed = await this.rssFeed.getFeed(url, 25);
      this.newsList = feed.items;
    }
    catch(e) { console.log(e) }
  }

}
