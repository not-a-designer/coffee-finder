import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import { IonicModule }          from '@ionic/angular';

import { PrivacyPage }          from './privacy.page';


const routes: Routes = [{ path: '', component: PrivacyPage }];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],

  declarations: [PrivacyPage],

  exports: [ PrivacyPage ],

  entryComponents: [ PrivacyPage ]
})
export class PrivacyPageModule {}
