import { Component, 
         EventEmitter, 
         Input, 
         OnInit, 
         Output }              from '@angular/core';

import { Venue, VenueDetails } from '@app-interfaces/foursquare/venue';
import { AuthService }         from '@app-services/auth/auth.service';
import { FourSquareService }   from '@app-services/four-square/four-square.service';
import { UserService }         from '@app-services/user/user.service';
import { User }                from '@app-interfaces/coffee-user';



@Component({
  selector: 'venue-details-card',
  templateUrl: './venue-details-card.component.html',
  styleUrls: ['./venue-details-card.component.scss']
})
export class VenueDetailsCardComponent implements OnInit {

  @Input('venue') 
  public venue: Venue;

  @Input('user')
  public user: User;

  @Output('toggleFavorite') 
  public toggleFavorite: EventEmitter<Venue> = new EventEmitter<Venue>();

  //details: VenueDetails = null;
  public venueCatIcon: string = '';

  constructor(private auth: AuthService,private foursquare: FourSquareService, private users: UserService) {
    
  }

  async ngOnInit(): Promise<void> {
    console.log('info window', this.user);
    console.log(this.user ? this.user.uid : 'null');
    //this.user$ = this.auth.user$;
    console.log('venue categories: ', this.venue.categories.length);
    const firstCat = this.venue.categories[0];
    console.log(this.venueCatIcon);
    this.venueCatIcon = firstCat.icon.prefix.concat('bg_32', firstCat.icon.suffix);
    console.log(this.venueCatIcon);
    //this.venueCatIcon = await this.foursquare.getVenueCategories()
    /*try { 
      this.venue = this.navParams.get('venue');
      //this.details = await this.foursquare.getVenueDetails(this.venue.id);
      //console.dir(this.details.bestPhoto);
    }
    catch(e) { console.log('component error: ', e) }*/
  }

  public addFavorite(): void { this.toggleFavorite.emit(this.venue) }
}
