
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import { IonicModule }          from '@ionic/angular';

//import { AdsenseModule }        from 'ng2-adsense';

import { environment }          from '@environments/environment';
import { ComponentsModule }     from '@app-components/components.module';
import { HomePage }             from '@app-pages/home/home.page';
import { PipesModule }          from '@app-pipes/pipes.module';


const routes: Routes = [{ path: '', component: HomePage }];


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    /*AdsenseModule.forRoot({
      adClient: environment.adSenseConfig.google_ad_client,
      adSlot: environment.adSenseConfig.google_ad_slot,
      pageLevelAds: environment.adSenseConfig.enable_page_level_ads
    }),*/
    ComponentsModule,
    PipesModule
  ],

  declarations: [ HomePage ],

  exports: [ HomePage ],

  entryComponents: [ HomePage ]
})
export class HomePageModule {}
