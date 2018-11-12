import { Component, OnInit, ViewChild } from '@angular/core';

import { LoadingController, Platform }  from '@ionic/angular';

import { MapsAPILoader, AgmMap }        from '@agm/core';
import { GoogleMapsAPIWrapper }         from '@agm/core/services';

import { MapService }                   from '@app-services/map/map.service';


@Component({
  selector: 'app-coffee-map',
  templateUrl: './coffee-map.page.html',
  styleUrls: ['./coffee-map.page.scss'],
})
export class CoffeeMapPage implements OnInit {

  @ViewChild(AgmMap) public map: AgmMap

  public geocoder: any;

  public mapLat: number;
  public mapLng: number;
  public mapZoom: number = 13;
  public showRadius: boolean = false;
  public radius: number = 1600;

  constructor(private mapsAPILoader: MapsAPILoader,
              private googleMapsAPIWrapper: GoogleMapsAPIWrapper,
              private loadingCtrl: LoadingController,
              private platform: Platform, 
              private maps: MapService) { }

  public ngOnInit(): void {
    this.maps.lat.subscribe((latitude) => this.mapLat = latitude);
    this.maps.lng.subscribe((longitude) => this.mapLng = longitude);
    this.maps.zoom.subscribe((z) => this.mapZoom = z);
    this.getCurrentLocation();
  }

  async getCurrentLocation(): Promise<void> {
    try {
      const loader = await this.loadingCtrl.create({
        duration: 750,
        spinner: 'circles',
        message: 'loading map...',
        keyboardClose: true
      });

      await loader.present();

      if (this.platform.is('cordova')) await this.maps.getNativePosition();
      else await this.maps.getBrowserPosition();
    }
    catch(e) { console.log('getCurrentPosition() error: ', e) }
    
  }

  public async loadMap(): Promise<void> {
    try {
      await this.mapsAPILoader.load();
      this.geocoder = new google.maps.Geocoder();
    }
    catch(e) { console.log('loadMap() error: ', e) }
  }

  toggleRadius() { this.showRadius = !this.showRadius }

}
