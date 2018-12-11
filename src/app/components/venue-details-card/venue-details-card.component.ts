import { Component, OnInit } from '@angular/core';

import { AlertController, 
         ModalController,
         NavParams, 
         Platform }          from '@ionic/angular';

import { AuthService }       from '@app-services/auth/auth.service';
import { UserService }       from '@app-services/user/user.service';
import { CoffeeUser }        from '@app-interfaces/coffee-user';


declare const google: any;


@Component({
  selector: 'venue-details-card',
  templateUrl: './venue-details-card.component.html',
  styleUrls: ['./venue-details-card.component.scss']
})
export class VenueDetailsCardComponent implements OnInit {

  public venue: google.maps.places.PlaceResult;
  public user: CoffeeUser;

  public venueCatIcon: string = '';
  public streetAddress: string = '';
  public cityStateZip: string = '';

  constructor(private navParams: NavParams, 
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              public platform: Platform,
              private auth: AuthService,
              private users: UserService) {
    
  }

  async ngOnInit(): Promise<void> {
    this.auth.user$.subscribe((u) => this.user = u)
    this.venue = this.navParams.get('venue');
    //console.log('venue cmp: ', this.venue);


    this.venueCatIcon = this.venue.icon;
    this.venue.address_components.forEach((comp) => {
      if (comp.types.includes('street_number')) this.streetAddress += comp.short_name;
      if (comp.types.includes('route')) this.streetAddress += ` ${comp.short_name}`;
      if (comp.types.includes('locality')) this.cityStateZip += comp.short_name;
      if (comp.types.includes('administrative_area_level_1')) this.cityStateZip += `, ${comp.short_name}`;
      if (comp.types.includes('postal_code')) this.cityStateZip += ` ${comp.short_name}`;
    });
    //console.log(this.streetAddress);
    //console.log(this.cityStateZip);
  }

  public dismiss(): void { this.modalCtrl.dismiss() }

  public getDirections(): void {
    const data = { 
      lat: this.venue.geometry.location.lat(), 
      lng: this.venue.geometry.location.lng() 
    };
    this.modalCtrl.dismiss(data);
  }

  public addFavorite(): void { 
    this.user.favorite = {
      address: this.venue.formatted_address,
      icon: this.venue.icon,
      id: this.venue.place_id,
      name: this.venue.name,
      lat: this.venue.geometry.location.lat(), 
      lng: this.venue.geometry.location.lng()
    };
    this.users.updateUserSettings(this.user);
    this.modalCtrl.dismiss({ data: 'favorite-set' });
  }

  public async showRemoveFavoriteAlert(): Promise<void> {
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
            this.user.favorite = null;
            this.users.updateUserSettings(this.user);
            this.modalCtrl.dismiss({ data: 'favorite-cleared' });
          }
        }]
      });
      await alert.present();
    }
    catch(e) { console.log('showRemoveFavoriteAlert() error: ', e) }
  }

  get isSmall(): boolean { return this.platform.width() > 692 }
}
