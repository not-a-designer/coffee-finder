import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';
import { Routes, RouterModule }             from '@angular/router';

import { IonicModule }                      from '@ionic/angular';

import { AgmCoreModule }                    from '@agm/core';
import { AgmSnazzyInfoWindowModule }        from '@agm/snazzy-info-window';

import { environment }                      from '@environments/environment';
import { ComponentsModule }                 from '@app-components/components.module';
import { CoffeeMapPage }                    from '@app-pages/coffee-map/coffee-map.page';


const routes: Routes = [{ path: '', component: CoffeeMapPage }];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({ apiKey: environment.firebase.apiKey }),
    AgmSnazzyInfoWindowModule,
    ComponentsModule
  ],

  declarations: [ CoffeeMapPage ],

  exports: [ CoffeeMapPage ],

  entryComponents: [ CoffeeMapPage ],

  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CoffeeMapPageModule {}
