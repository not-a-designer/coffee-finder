import { Venue }     from '@app-interfaces/foursquare/venue';

import * as firebase from 'firebase/app';


export interface CoffeeUser {
    uid: string;
    email: string;
    isAdmin: boolean;
    emailVerified: boolean;
    providerData: Array<firebase.UserInfo>;
    displayName?: string;
    favorite?: Venue;
    firstName?: string;
    lastName?: string;
}

/*export class CoffeeUser {

    public currentProvider: firebase.UserInfo = null;

    constructor(public uid: string,
                public email: string,
                public isAdmin: boolean,
                public emailVerified: boolean,
                public providerData: Array<firebase.UserInfo>,
                public displayName?: string,
                public favorite?: Venue,
                public firstName?: string,
                public lastName?: string){
        if (this.providerData.length > 0) this.currentProvider = this.providerData[0];
    }

    addProvider(providerData: any): void { this.providerData.push(providerData) }

    removeProvider(provider: any): void { 
        const index = this.providerData.indexOf(provider);
        this.providerData.splice(index, 1);
    }

    clearProviders() {
        this.providerData = [];
    }

    //get providers(): string[] { return this.providers }
}*/