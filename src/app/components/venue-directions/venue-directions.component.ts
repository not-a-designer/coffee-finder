import { Component, 
         ElementRef,
         OnInit,
         ViewChild }                  from '@angular/core';

import { NavParams, ModalController } from '@ionic/angular';

import { MapsAPILoader }              from '@agm/core';


declare const google: any;


@Component({
  selector: 'app-venue-directions',
  templateUrl: './venue-directions.component.html',
  styleUrls: ['./venue-directions.component.scss']
})
export class VenueDirectionsComponent implements OnInit {

  @ViewChild('directionsMap') 
  public mapElement: ElementRef;

  public map: any;
  public directions: google.maps.DirectionsResult;
  public  directionsDisplay: any;

  public currentLatLng: google.maps.LatLng;
  public destination: string;
  public routeSteps: Array<any> = [];

  constructor(private navParams: NavParams, private mapsAPILoader: MapsAPILoader, private modalCtrl: ModalController) { }

  public async ngOnInit(): Promise<void> {
    try {
      this.currentLatLng = this.navParams.get('latLng');
      this.destination = this.navParams.get('dest');
      this.directions = this.navParams.get('directionsResult');
      console.log(this.directions);
      await this.loadMap();

     
    }
    catch(e) { console.log(e) }
  }

  private async loadMap(): Promise<void> {
    try {
      await this.mapsAPILoader.load();
      
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: this.currentLatLng,
        zoom: 14,
        clickableIcons: false,
        disableDefaultUI: true,
        draggable: false
      });
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        this.directionsDisplay = new google.maps.DirectionsRenderer();
        this.directionsDisplay.setMap(this.map);

        this.directionsDisplay.setDirections(this.directions);

        this.routeSteps = this.directions.routes[0].legs[0].steps;
        //this.routeSteps.forEach((step) => console.log(step.instructions));

        this.map.fitBounds(this.directionsDisplay.getDirections().routes[0].bounds);
      });
    }
    catch(e) { console.log(e) }
  }

  public dismiss(): void { this.modalCtrl.dismiss() }

}
