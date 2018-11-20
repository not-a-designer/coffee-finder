import { VenueDetails, VenueCategory } from './venue';
import { Venue }        from '@app-interfaces/foursquare/venue';


export interface VenueResponse {
    meta: { 
      code: number; 
      requestId: string;
    };
    response: {
      venues: Array<Venue>;
    };
  };

  export interface VenueDetailsResponse {
    meta: {
      code: number;
      requestId: string;
    };
    notifications?: {
      type: string;
      item: {
        unreadCount: number;
      };
    };
    response: {
      venue: VenueDetails;
    };
  }

  export interface VenueCategoryResponse {
    meta: {
      code: number;
      requestId: string;
    };
    notifications: {
      item: {
        unreadCount: number;
      };
      type: string;
    }
    response: {
      categories: Array<VenueCategory>;
    };
  }


  