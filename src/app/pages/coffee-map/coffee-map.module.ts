import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule }          from '@ionic/angular';

import { AgmCoreModule }        from '@agm/core';

import { environment }          from '@environments/environment';
import { CoffeeMapPage }        from '@app-pages/coffee-map/coffee-map.page';


const routes: Routes = [{ path: '', component: CoffeeMapPage }];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({ apiKey: environment.firebase.apiKey })
  ],

  declarations: [ CoffeeMapPage ],

  exports: [ CoffeeMapPage ],

  entryComponents: [ CoffeeMapPage ]
})
export class CoffeeMapPageModule {}
