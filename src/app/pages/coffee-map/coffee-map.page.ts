import { AfterViewInit, 
         Component, 
         OnInit, 
         ViewChild }                        from '@angular/core';

import { LoadingController, 
         Platform, 
         PopoverController, 
         ToastController, 
         AlertController,
         ModalController}                   from '@ionic/angular';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

import { MapsAPILoader, AgmMap }            from '@agm/core';

import { take }                             from 'rxjs/operators';

import { environment }                      from '@environments/environment.prod';
import { Venue, VenueDetails }              from '@app-interfaces/foursquare/venue';
import { FourSquareService }                from '@app-services/four-square/four-square.service';
import { MapService }                       from '@app-services/map/map.service';
import { RadiusSliderComponent }            from '@app-components/radius-slider/radius-slider.component';
import { CoffeeUser }                       from '@app-interfaces/coffee-user';
import { UserService }                      from '@app-services/user/user.service';
import { AuthService }                      from '@app-services/auth/auth.service';
import { VenueDetailsCardComponent } from '@app-components/venue-details-card/venue-details-card.component';


declare const google: any;

const MARKER_LABEL: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface MyMarker {
  lat: number;
  lng: number;
  label: string;
  draggable: boolean
};


@Component({
  selector: 'app-coffee-map',
  templateUrl: './coffee-map.page.html',
  styleUrls: ['./coffee-map.page.scss'],
})
export class CoffeeMapPage implements OnInit, AfterViewInit {

  @ViewChild(AgmMap) 
  public map: AgmMap;

  selectedVenue: Venue;
  details: VenueDetails;
  venues: Venue[] = [];
  markers: MyMarker[] = [];
  adClient: string = environment.adSenseConfig.google_ad_client;
  adSlot: string = environment.adSenseConfig.google_ad_slot;

  public geocoder: any;

  public mapLat: number;
  public mapLng: number;
  public currentLat: number;
  public currentLng: number;
  public mapZoom: number = 13;
  public showRadius: boolean = false;
  public radius: number = 1600;
  user: CoffeeUser;

  bannerConfig: AdMobFreeBannerConfig = {
    isTesting: true,
    autoShow: false,
    id: environment.admobAppID,
    bannerAtTop: false
  };

  constructor(private mapsAPILoader: MapsAPILoader,
              private admob: AdMobFree, 
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private platform: Platform, 
              private modalCtrl: ModalController,
              private popoverCtrl: PopoverController,
              private toastCtrl: ToastController,
              private auth: AuthService,
              private foursquare: FourSquareService,
              private maps: MapService,
              private users: UserService) { }


  public ngOnInit(): void {
    this.startAdmob();
    this.auth.user$.pipe(take(1)).subscribe((user) => this.user = user);
    this.selectedVenue = null;
    this.maps.lat.subscribe((latitude: number) => {
      this.currentLat = latitude;
      this.mapLat = latitude;
    });
    this.maps.lng.subscribe((longitude: number) => {
      this.currentLng = longitude;
      this.mapLng = longitude;
    });
    this.maps.zoom.subscribe((z) => this.mapZoom = z);
    this.loadMap();
    this.getCurrentLocation();
  }

  public ngAfterViewInit(): void {
    //if (this.selectedVenue) this.selectedVenue = null;
  }

  async getCurrentLocation(): Promise<void> {
    try {
      this.selectedVenue = null;
      const loader = await this.loadingCtrl.create({
        spinner: 'circles',
        message: 'loading map...',
        keyboardClose: true,
        duration: 500
      });

      await loader.present();

      if (this.platform.is('cordova')) await this.maps.getNativePosition();
      else await this.maps.getBrowserPosition();

      setTimeout(async () => {
        this.venues = await this.foursquare.searchVenues('browse', this.radius);
        for (let venue of this.venues) this.createMarker(venue);
        loader.dismiss();
      }, 750);
    }
    catch(e) { console.log('getCurrentPosition() error: ', e) }
  }


  public async selectMarker(event, markerIndex: number): Promise<void> { 
    try { 
      console.log(`{ lat: ${event.latitude}, lng: ${event.longitude} }`);
      const venueMarker: Venue = this.venues[markerIndex];

      console.log(`setting selectedVenue to ${venueMarker.name}`);
      console.log('map', this.user);
      this.selectedVenue = venueMarker;
      this.mapLat = event.latitude;
      this.mapLng = event.longitude;
      this.maps.panTo(event.latitude, event.longitude);

      const modal = await this.modalCtrl.create({
        component: VenueDetailsCardComponent,
        componentProps: { venue: this.selectedVenue },
        cssClass: 'info-modal',
        backdropDismiss: true,
        showBackdrop: true
      });
      return await modal.present();    
    }
    catch(e) { console.log('selectMarker() error: ', e) }
  }

  public async loadMap(): Promise<void> {
    try {
      await this.mapsAPILoader.load();
      this.geocoder = new google.maps.Geocoder();
    }
    catch(e) { console.log('loadMap() error: ', e) }
  }

  createMarker(venue: Venue): void {
    let index : number = this.venues.indexOf(venue);
    const newMarker: MyMarker = {
      lat: venue.location.lat,
      lng: venue.location.lng,
      label: `${MARKER_LABEL.charAt(index)}`,
      draggable: false
    };
    
    this.markers.push(newMarker);
  }

  public async showRadiusPopover(event): Promise<void> {
    try {
      this.selectedVenue = null;
      const popover = await this.popoverCtrl.create({
        component: RadiusSliderComponent,
        componentProps: { currentRadius: this.radius },
        cssClass: 'popover-radius',
        event: event,
        animated: true,
        translucent: false,
        keyboardClose: true,
      });

      await popover.present();

      const { data } = await popover.onWillDismiss();
      if (data) {
        const loader = await this.loadingCtrl.create({ 
          message: 'updating radius...', 
          spinner: 'circles',
          duration: 500 
        });
  
        await loader.present();
        console.log('radius returned: ', data.radius);
        this.radius = data.radius;
        
        let limit: number;
        switch(true) {
          case (this.radius < 2400): {
            limit = 10
            break;
          }
          case (this.radius >= 2400 && this.radius < 4000):  { 
            limit = 15;
            break;
          }
          case (this.radius >= 4000): { 
            limit = 20;
            break;
          }
        }
        console.log(limit);
        this.markers = [];
        this.venues = await this.foursquare.searchVenues('browse', this.radius, limit);
        for (let venue of this.venues) this.createMarker(venue);
      }
    }
    catch(e) { console.log('radiusPopover() error: ', e) }
  }

  public toggleFavorite(event: Venue): void {
    console.log('event: ', event);
    if (this.user && this.user.favorite && this.user.favorite.id === event.id) this.showRemoveFavoriteAlert();
    else this.addToFavorites(event);
  }

  private addToFavorites(v: Venue): void {
    this.user.favorite = v;
    this.users.updateUserSettings(this.user);
    this.showFavoriteToast(`${v.name} has been successfully stored as your favorite location!`);
  }

  private async showRemoveFavoriteAlert(): Promise<void> {
    try {
      const alert = await this.alertCtrl.create({
        header: 'remove Favorite',
        message: 'Are you sure you want to remove this location as your favorite?',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('cancel, keep favorite')
        }, {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            const prevLocation: Venue = this.user.favorite;
            this.user.favorite = null;
            this.users.updateUserSettings(this.user);
            this.showFavoriteToast(`${prevLocation.name} has been removed as your favorite!`);
          }
        }]
      });
      await alert.present();
    }
    catch(e) { console.log('showRemoveFavoriteAlert() error: ', e) }
  }

  private async showFavoriteToast(msg: string): Promise<void> {
    try {
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 2000,
        position: 'middle'
      });
      await toast.present();
    }
    catch(e) { console.log(e) }
  }

  private async startAdmob(): Promise<void> {
    try {
      await this.platform.ready();

      this.admob.banner.config(this.bannerConfig);
      await this.admob.banner.prepare();
      await this.admob.banner.show();
      console.log('banner ready');
    }
    catch(e) { console.log('startAdmob() error: ', e) }
  }

  private async hideAdmob(): Promise<void> {
    try {
      await this.platform.ready();
      await this.admob.banner.hide();
    }
    catch(e) { console.log('hideAdmob() error: ', e) }
  }


  get isCordova(): boolean { return this.platform.is('cordova') }

}
