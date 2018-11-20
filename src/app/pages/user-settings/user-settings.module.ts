import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule }          from '@ionic/angular';

import { UserSettingsPage }     from './user-settings.page';
import { PipesModule }          from '@app-pipes/pipes.module'; 


const routes: Routes = [{ path: '', component: UserSettingsPage }];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],

  declarations: [ UserSettingsPage ],

  exports: [ UserSettingsPage ],

  entryComponents: [ UserSettingsPage ]
})
export class UserSettingsPageModule {}
