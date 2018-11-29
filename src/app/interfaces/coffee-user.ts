import * as firebase from 'firebase/app';


declare const google: any;


export interface CoffeeUser {
    uid: string;
    email: string;
    isAdmin: boolean;
    emailVerified: boolean;
    providerData: Array<firebase.UserInfo>;
    displayName?: string;
    favorite?: {
        address: string;
        icon: string;
        id: string;
        lat: number;
        lng: number;
        name: string;
    };
    firstName?: string;
    lastName?: string;
}