import { Venue } from '@app-interfaces/foursquare/venue';


export interface User {
    uid: string;
    email: string;
    isAdmin: boolean;
    emailVerified: boolean;
    providerId: any;
    favorite?: Venue;
    firstName?: string;
    lastName?: string;
    displayName?: string;
}