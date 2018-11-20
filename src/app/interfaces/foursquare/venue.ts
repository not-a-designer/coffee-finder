export interface Venue {
    id: string;
    name: string;
    location: VenueLocation;
    categories?: Array<VenueCategory>;
    venuePage: {
        id: string;
    }
};

export interface VenueDetails {
    id: string;
    name: string;
    contact?: VenueContact;
    location?: VenueLocation;
    canonicalUrl?: string;
    categories?: Array<VenueCategory>;
    verified?: boolean;
    stats?: any;
    url?: string;
    likes?: any;
    rating?: number;
    ratingColor?: string;
    ratingSignals?: number;
    beenHere?: any;
    photos?: any;
    description?: string;
    storeId?: string;
    page?: any;
    hereNow?: any;
    createdAt?: number;
    tips?: any;
    shortUrl?: string;
    timeZone?: string;
    listed?: any;
    phrases?: Array<any>;
    hours?: any;
    popular?: any;
    pageUpdate?: any;
    inbox?: any;
    venueChains?: Array<any>;
    attributes?: any;
    roles?: string;
    bestPhoto?: any;
}

export interface VenueCategory {
    id?: string;
    name?: string;
    pluralName?: string;
    shortName?: string;
    icon?: {
        prefix: string;
        suffix: string;
    };
    primary?: boolean
};

export interface VenueLocation {
    address?: string;
    crossStreet?: string;
    lat?: number;
    lng?: number;
    labeledLatLngs?: Array<LabeledLatLng>;
    distance?: number;
    postalCode?: string;
    cc?: string;
    city?: string;
    country?: string;
    formattedAddress?: Array<string>
};



interface VenueContact {
    phone?: string;
    twitter?: string;
    formattedPhone?: string;
    instagram?: string;
    facebook?: string;
    facebookUsername?: string;
    facebookName?: string;
};

interface LabeledLatLng {
    label?: string;
    lat?: number;
    lng?: number;
  }