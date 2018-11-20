import { Injectable }                                                 from '@angular/core';
import { HttpClient }                                                 from '@angular/common/http';

import { environment }                                                from '@environments/environment';
import { MapService }                                                 from '@app-services/map/map.service';
import { VenueResponse, VenueDetailsResponse, VenueCategoryResponse } from '@app-interfaces/foursquare/venue-response';
import { Venue, VenueDetails, VenueCategory }                         from '@app-interfaces/foursquare/venue';


@Injectable({ providedIn: 'root' })
export class FourSquareService {

  private _baseUrl: string = 'https://api.foursquare.com/v2';
  private _authParams: string = `client_id=${environment.foursquareConfig.secrets.clientId}&client_secret=${environment.foursquareConfig.secrets.clientSecret}&v=20181101`;

  baseSearchUrl: string = `${this._baseUrl}/venues/search?${this._authParams}`;
  mapLat: number;
  mapLng: number;

  constructor(private httpClient: HttpClient, private maps: MapService) { 
    this.maps.lat.subscribe((latitude) => this.mapLat = latitude);
    this.maps.lng.subscribe((longitude) => this.mapLng = longitude);
  }

  /**
   * @public searchVenues()
   * - performs http request to Foursquare API to retrieve a list of venues
   * @param intent string ('browse' | 'global' | 'match' | 'checkin')
   * @param radius number
   * @param limit number (optional) 
   * @returns Promise<Venue[]>
   */
  public searchVenues(intent: string, radius: number, limit?: number): Promise<Venue[]> {
    let promise = new Promise<Venue[]>(async (resolve, reject) => {
      try {
        limit = limit || 10;
        const reqUrl: string = `${this.baseSearchUrl}&intent=${intent}&ll=${this.mapLat},${this.mapLng}&radius=${radius}&query=coffee&limit=${limit}`;
        let results = await this.httpClient.get<VenueResponse>(reqUrl, { observe: 'body' }).toPromise();
        //console.log({ results });
        if (results.meta.code === 200) resolve(results.response.venues);
      }
      catch(error) { reject(error) }
    });

    return promise;
  }

  /**
   * @public getVenueDetails()
   * - performs http request to Fursquare API to retrieve a specific venue
   * @param venueId string
   * @returns Promise<VenueDetails>
   */
  public getVenueDetails(venueId: string): Promise<VenueDetails> {
    let promise = new Promise<VenueDetails>(async (resolve, reject) => {
      try {
        const detailsUrl = `${this._baseUrl}/venues/${venueId}`;
        const reqUrl: string = `${detailsUrl}?${this._authParams}`;
        let results = await this.httpClient.get<VenueDetailsResponse>(reqUrl, { observe: 'body' }).toPromise();
        //console.log(results);
        if (results.meta.code === 200) resolve(results.response.venue);
      }
      catch(e) { reject(e) }
    });
    return promise;
  }

  /**
   * @public getVenueCategories()
   * - performs http request to Foursquare API to retrieve category list
   * @returns Promise<VenueCategory[]>
   */
  public getVenueCategories(): Promise<VenueCategory[]> {
    let promise = new Promise<VenueCategory[]>(async (resolve, reject) => {
      try {
        const catUrl: string = `${this._baseUrl}/venues/categories`
        const reqUrl: string = `${catUrl}?${this._authParams}`;
        let results = await this.httpClient.get<VenueCategoryResponse>(reqUrl, { observe: 'body' }).toPromise();
        //console.log(results);
        if (results.meta.code === 200) resolve(results.response.categories);
      }
      catch(e) { reject(e) }
    });
    return promise;
  }
}
