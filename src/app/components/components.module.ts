import { NgModule }                  from "@angular/core";
import { CommonModule }              from '@angular/common';

import { IonicModule }               from '@ionic/angular';

import { VenueDetailsCardComponent } from '@app-components/venue-details-card/venue-details-card.component';
import { StarRatingComponent }       from '@app-components/star-rating/star-rating.component';
import { RadiusSliderComponent }     from '@app-components/radius-slider/radius-slider.component';


@NgModule({
    declarations: [ 
        VenueDetailsCardComponent, 
        StarRatingComponent, 
        RadiusSliderComponent
    ],

    imports: [
        CommonModule,
        IonicModule
    ],

    exports: [ 
        VenueDetailsCardComponent, 
        StarRatingComponent, 
        RadiusSliderComponent 
    ],

    entryComponents: [ 
        VenueDetailsCardComponent, 
        StarRatingComponent, 
        RadiusSliderComponent 
    ]
})
export class ComponentsModule {}