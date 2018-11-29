import { NgModule }                  from "@angular/core";
import { CommonModule }              from '@angular/common';

import { IonicModule }               from '@ionic/angular';

import { PipesModule }               from "@app-pipes/pipes.module";
import { VenueDetailsCardComponent } from '@app-components/venue-details-card/venue-details-card.component';
import { StarRatingComponent }       from '@app-components/star-rating/star-rating.component';
import { RadiusSliderComponent }     from '@app-components/radius-slider/radius-slider.component';
import { VenueDirectionsComponent }  from './venue-directions/venue-directions.component';
import { AdsenseBannerComponent }    from './adsense-banner/adsense-banner.component';


@NgModule({
    declarations: [ 
        VenueDetailsCardComponent, 
        StarRatingComponent, 
        RadiusSliderComponent, 
        VenueDirectionsComponent, 
        AdsenseBannerComponent
    ],

    imports: [
        CommonModule,
        IonicModule,
        PipesModule
    ],

    exports: [ 
        VenueDetailsCardComponent, 
        StarRatingComponent, 
        RadiusSliderComponent, 
        VenueDirectionsComponent, 
        AdsenseBannerComponent
    ],

    entryComponents: [ 
        VenueDetailsCardComponent, 
        StarRatingComponent, 
        RadiusSliderComponent, 
        VenueDirectionsComponent, 
        AdsenseBannerComponent
    ]
})
export class ComponentsModule {}