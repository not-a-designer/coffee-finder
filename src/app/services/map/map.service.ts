import { Injectable }      from '@angular/core';

import { Geolocation }     from '@ionic-native/geolocation/ngx';

import { BehaviorSubject } from 'rxjs';


declare const navigator: any;


@Injectable({
  providedIn: 'root'
})
export class MapService {

  private _lat: number;
  private _lng: number;
  private _zoom: number;

  public lat: BehaviorSubject<number> = new BehaviorSubject<number>(43.0389);
  public lng: BehaviorSubject<number> = new BehaviorSubject<number>(-87.9067);
  public zoom: BehaviorSubject<number> = new BehaviorSubject<number>(13);

  private _geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  constructor(private geolocation: Geolocation) { }

  public async getNativePosition() {
    try {
      const position = await this.geolocation.getCurrentPosition(this._geolocationOptions);
      this._lat = position.coords.latitude;
      this._lng = position.coords.longitude;
      this._zoom = 13;

      this.lat.next(this._lat);
      this.lng.next(this._lng);
      this.zoom.next(this._zoom);
      //this.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    }
    catch(e) { console.log('native location error: ', e) }
  }

  public async getBrowserPosition() {
    try { 
      //helper success callback
      const success = (position) => { 
        this._lat = position.coords.latitude;
        this._lng = position.coords.longitude;
        this._zoom = 13;

        this.lat.next(this._lat);
        this.lng.next(this._lng);
        this.zoom.next(this._zoom);
        //new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      };

      //helper error callback
      const error = (error) => { console.log('currentLocation error: ', error) };

      //browser geolocation method
      await navigator.geolocation.getCurrentPosition(success, error, this._geolocationOptions);
    }
    catch(e) { console.log('navigator error: ', e) }
  }
}