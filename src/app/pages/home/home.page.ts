import { AfterViewInit, 
         Component, 
         OnInit, 
         ViewChild }                 from '@angular/core';

import { Content,
         LoadingController, 
         Platform, 
         ToastController }           from '@ionic/angular';

import { Observable }                from 'rxjs';

import { environment }               from '@environments/environment';
import { AuthService }               from '@app-services/auth/auth.service';
import { RssFeedService, RSSResult } from '@app-services/rss-feed/rss-feed.service';
import { CoffeeUser }                from '@app-interfaces/coffee-user';


interface RssData {
  url: string;
  name: string;
  title: string;
};


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements AfterViewInit, OnInit {

  @ViewChild(Content) public content: Content;

  public user$: Observable<CoffeeUser>;
  public feeds: Array<RssData> = [
    {
      url: 'https://sprudge.com/feed/',
      name: 'sprudge',
      title: 'Sprudge'
    }, {
      url: 'https://dailycoffeenews.com/feed/',
      name: 'dcn',
      title: 'Daily Coffee News by Roast Magazine'
    }, {
      url: 'https://blog.pactcoffee.com/feed/',
      name: 'pcb',
      title: 'The Perc'
    }, {
      url: 'https://www.reddit.com/r/Coffee/.rss',
      name: 'rcoffee',
      title: 'Coffee'
    }, {
      url: 'https://perfectdailygrind.com/feed',
      name: 'pdg',
      title: 'Perfect Daily Grind'
    }, {
      url: 'https://www.coffeereview.com/feed/',
      name: 'coffeereview',
      title: 'Coffee Review'
    }, {
      url: 'https://colectivocoffee.com/feed',
      name: 'colectivo',
      title: 'Colectivo Coffee'
    }
  ];
  public selectedFeed: RssData;
  public selectedTitle: string = this.feeds[0].title;

  public currentFeed: RSSResult;

  public isGrid: boolean = true;

  constructor(private auth: AuthService, 
              public platform: Platform, 
              private toastCtrl: ToastController,
              private rssFeed: RssFeedService,
              private loadingCtrl: LoadingController) {}

  public async ngOnInit(): Promise<void> { 
    try {
      this.user$ = this.auth.user$;
      this.setCurrentFeed(0, null);
    }
    catch(e) { console.log(e) }
  }

  public async ngAfterViewInit() {
    try {
      if (!this.platform.is('desktop')) {
        const toast = await this.toastCtrl.create({
          message: 'Pull down to refresh',
          position: 'top',
          duration: 2000
        });
        await toast.present();
      }
    }
    catch(e) { console.log(e) }
  }

  public doRefresh(event) {
    //console.log({ event });
    //console.log('Refreshing news feed...');

    setTimeout(() => {
      this.getFeed();
      event.target.complete();
      this.content.scrollToTop();
    }, 500);
  }

  public async setCurrentFeed(index: number, event) {
    try {
      
      const loader = await this.showLoader('Loading feed...');
      await loader.present();

      //console.log({ event });
      this.selectedFeed = this.feeds[index];
      this.selectedTitle = this.selectedFeed.title;
      //console.log('current feed set: ', this.selectedFeed.title);
      await this.getFeed();
      this.content.scrollToTop();
      loader.dismiss();
    }
    catch(e) { console.log(e) }
  }

  public async getFeed(): Promise<void> {
    try {
      this.currentFeed = await this.rssFeed.getFeed(this.selectedFeed.url, '25');
      //console.log(this.currentFeed.items.length);
      //console.log( this.currentFeed.items[0] )
    }
    catch(e) { console.log(e) }
  }

  public async toggleView(): Promise<void> {
    try {
      const nextPosition: string = this.isGrid ? 'list' : 'grid';
      const loader = await this.showLoader(`switching to ${nextPosition} view...`, 600)
      await loader.present();

      this.isGrid = !this.isGrid;
      //console.log('view is grid: ', this.isGrid);
    }
    catch(e) { console.log(e) }
  }

  private async showLoader(msg: string, dur?: number): Promise<HTMLIonLoadingElement> {
    try {
      return await this.loadingCtrl.create({
        message: msg,
        spinner: 'circles',
        duration: dur || null
      });
    }
    catch(e) { console.log(e) }
  }
}
