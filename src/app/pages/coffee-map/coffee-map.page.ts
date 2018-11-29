import { AfterViewInit, 
         Component, 
         ElementRef,
         OnInit, 
         ViewChild }                        from '@angular/core';

import { LoadingController, 
         Platform, 
         PopoverController, 
         ToastController, 
         AlertController,
         ModalController}                   from '@ionic/angular';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

import { MapsAPILoader }                    from '@agm/core';

import { take }                             from 'rxjs/operators';

import { environment }                      from '@environments/environment.prod';
import { MapService }                       from '@app-services/map/map.service';
import { RadiusSliderComponent }            from '@app-components/radius-slider/radius-slider.component';
import { CoffeeUser }                       from '@app-interfaces/coffee-user';
import { UserService }                      from '@app-services/user/user.service';
import { AuthService }                      from '@app-services/auth/auth.service';
import { VenueDetailsCardComponent }        from '@app-components/venue-details-card/venue-details-card.component';
import { VenueDirectionsComponent }         from '@app-components/venue-directions/venue-directions.component';


declare const google: any;

const FIELDS: string[] = [ 
  'address_components',
  'adr_address',
  'alt_id',
  'formatted_address', 
  //'formatted_phone_number', // CONTACT
  'geometry', 
  'icon', 
  'id', 
  //'international_phone_number', // CONTACT
  'name', 
  //'opening_hours', // CONTACT
  'permanently_closed', 
  'photos', 
  'place_id', 
  'plus_code',
  //'price_level, // ATOMSPHERE
  //'rating', // ATMOSPHERE
  //'review', // ATMOSPHERE
  'scope',
  'type',
  'url',
  'utc_offset',
  'vicinity',
  //'website' // CONTACT
];


@Component({
  selector: 'app-coffee-map',
  templateUrl: './coffee-map.page.html',
  styleUrls: ['./coffee-map.page.scss'],
})
export class CoffeeMapPage implements OnInit, AfterViewInit {

  //@ViewChild(AgmMap) 
  //public agmMap: AgmMap;
  @ViewChild('map') mapElement: ElementRef;
  

  selectedVenue: google.maps.places.PlaceResult;
  details: google.maps.places.PlaceResult;
  venues: google.maps.places.PlaceResult[] = [];
  markers: any[] = [];
  adClient: string = environment.adSenseConfig.google_ad_client;
  adSlot: string = environment.adSenseConfig.google_ad_slot;

  public map: any;
  public geocoder: any;
  public directionsService: any;
  //public directionsDisplay: any;
  public placesService: any;
  public radiusCircle: any;

  //public mapLat: number;
  //public mapLng: number;
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

  mapOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
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
              private maps: MapService,
              private users: UserService) { }


  public ngOnInit(): void {
    this.startAdmob();
    this.auth.user$.pipe(take(1)).subscribe((user) => this.user = user);
    this.selectedVenue = null;
    this.getCurrentLocation();

    
    this.loadMap();
  }

  public ngAfterViewInit(): void {
    this.maps.lat.subscribe((latitude: number) => {
      this.currentLat = latitude;
      //this.mapLat = latitude;
    });
    this.maps.lng.subscribe((longitude: number) => {
      this.currentLng = longitude;
      //this.mapLng = longitude;
    });
    this.maps.zoom.subscribe((z) => this.mapZoom = z);
  }

  async getCurrentLocation(): Promise<void> {
    try {
      if (this.platform.is('cordova')) await this.maps.getNativePosition();
      else await this.maps.getBrowserPosition();
    }
    catch(e) { console.log('getCurrentPosition() error: ', e) }
  }

  async updateLocation() {
    try {
      const loader = await this.loadingCtrl.create({ message: 'locating...', spinner: 'circles' });
      await loader.present();
      this.getCurrentLocation();
      this.map.panTo(new google.maps.LatLng(this.currentLat, this.currentLng));
      this.nearbySearch();
      loader.dismiss();
    }
    catch(e) { console.log(e) }

  }
  /*public async selectMarker(event, markerIndex: number): Promise<void> { 
    try { 
      console.log(`{ lat: ${event.latitude}, lng: ${event.longitude} }`);
      const venueMarker = this.venues[markerIndex];

      console.log(`setting selectedVenue to ${venueMarker.name}`);
      console.log('map', this.user);
      this.selectedVenue = venueMarker;
      this.mapLat = event.latitude;
      this.mapLng = event.longitude;
      //await this.mapsAPIWrapper.panTo(new google.maps.LatLng(event.latitude, event.longitude));

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
  }*/

  public async loadMap(): Promise<void> {
    try {
      this.selectedVenue = null;
      const loader = await this.loadingCtrl.create({
        spinner: 'circles',
        message: 'loading map...',
        keyboardClose: true,
        duration: 500
      });

      await loader.present();

      this.getCurrentLocation();
      await this.mapsAPILoader.load();
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: new google.maps.LatLng(this.currentLat, this.currentLng),
        zoom: 13,
        clickableIcons: false,
        disableDefaultUI: true
      });
      this.map.panTo(new google.maps.LatLng(this.currentLat, this.currentLng));
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        this.geocoder = new google.maps.Geocoder();
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.directionsService = new google.maps.DirectionsService();
        //this.directionsDisplay = new google.maps.DirectionsRenderer();

        //this.directionsDisplay.setMap(this.map);
        //this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);

        this.radiusCircle = new google.maps.Circle({
          strokeColor: '#3171e0',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3171e0',
          fillOpacity: 0.35,
          map: this.map,
          center: new google.maps.LatLng(this.currentLat, this.currentLng),
          radius: this.radius
        });

        this.nearbySearch();
        loader.dismiss();
      });
    }
    catch(e) { console.log('loadMap() error: ', e) }
  }

  createMarker(lat: number, lng: number, index: number): void {
    const location = { lat: lat, lng: lng }
    const marker = new google.maps.Marker({
      map: this.map,
      position: location
    });
    google.maps.event.addListener(marker, 'click', (event) => {
      this.map.panTo(marker.getPosition());
      this.setSelected(index);
    });
    this.markers.push(marker);
  }

  async setSelected(index: number) {
    try {
      this.selectedVenue = this.venues[index];
      await this.getDetails(this.selectedVenue);

      setTimeout(async () => {
        
        const modal = await this.modalCtrl.create({
          component: VenueDetailsCardComponent,
          componentProps: { venue: this.details },
          cssClass: 'info-modal',
          backdropDismiss: true,
          showBackdrop: true
        });
        
        await modal.present();   

        let detailEvent = await modal.onDidDismiss();
        
        if (detailEvent.data) {
          console.log((detailEvent.data['favorite']) ? 'favorite' : 'directions');
          if (detailEvent.data != undefined) console.log(detailEvent);
          if (detailEvent.data['favorite']) this.toggleFavorite(<google.maps.places.PlaceResult>detailEvent.data.favorite);
          if (detailEvent.data.lat && detailEvent.data.lng) this.getDirections(detailEvent.data.lat, detailEvent.data.lng);
        }
      }, 250);
    }
    catch(e) { console.log(e) }
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
        this.radiusCircle.setCenter(this.currentLat, this.currentLng)
        this.radiusCircle.setRadius(this.radius);
        this.map.panTo(new google.maps.LatLng(this.currentLat, this.currentLng));
        this.markers = [];
        this.nearbySearch();
      }
    }
    catch(e) { console.log('radiusPopover() error: ', e) }
  }

  public toggleFavorite(event: google.maps.places.PlaceResult): void {
    console.log('event: ', event);
    //if (this.user && this.user.favorite && this.user.favorite.id === event.place_id) this.showRemoveFavoriteAlert();
    this.addToFavorites(event);
  }

  private addToFavorites(place: google.maps.places.PlaceResult): void {
    this.user.favorite = {
      address: place.formatted_address,
      icon: place.icon,
      id: place.place_id,
      name: place.name,
      lat: place.geometry.location.lat(), 
      lng: place.geometry.location.lng()
    };
    this.users.updateUserSettings(this.user);
    this.showFavoriteToast(`${place.name} has been successfully stored as your favorite location!`);
  }

  public async nearbySearch() {
    try {
      const loader = await this.loadingCtrl.create({ message: 'Loading coffeeshops...', spinner: 'circles' })
      await loader.present();
      console.log(this.radius);
      const searchReq: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(this.currentLat, this.currentLng),
        radius: this.radius,
        keyword: 'coffee'
      };
      await this.mapsAPILoader.load();
      this.placesService.nearbySearch(searchReq, (results: google.maps.places.PlaceResult[], status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          if (results.length > 0) {
            this.venues = results;
            for (let venue of this.venues) {
              const location = venue.geometry.location;
              this.createMarker(location.lat(), location.lng(), this.venues.indexOf(venue));
            }
          }
        }
      });
      loader.dismiss();
    }
    catch(e) { console.log(e) }
  }

  public async getDetails(place: google.maps.places.PlaceResult): Promise<void> {
    try {
      const detailReq: google.maps.places.PlaceDetailsRequest = {
        placeId: place.place_id,
        fields: FIELDS
      };

      this.placesService.getDetails(detailReq, (result: google.maps.places.PlaceResult, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log({ result });
          this.details = result;
        }
      });
    }
    catch(e) { console.log(e) }
  }

  public getDirections(lat: number, lng: number) {
    this.directionsService.route({
      origin: new google.maps.LatLng(this.currentLat, this.currentLng),
      destination:  new google.maps.LatLng(lat, lng),
      travelMode: google.maps.TravelMode['DRIVING']
    }, async (result: google.maps.DirectionsResult, status) => {
      try { 
        if (status == google.maps.DirectionsStatus.OK) {
          //console.log({ result });
          const loader = await this.loadingCtrl.create({ message: 'Loading directions...', spinner: 'circles', duration: 500 })
          await loader.present();

          const modal = await this.modalCtrl.create({
            component: VenueDirectionsComponent,
            componentProps: { 
              dest: this.details.name,
              latLng: new google.maps.LatLng(this.currentLat, this.currentLng),
              directionsResult: result
            },
            cssClass: 'directions-modal',
            animated: true
          });
          await modal.present();
          //this.directionsDisplay.setDirections(result);
        }
      }
      catch(e) { console.log(e) }
    });
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
