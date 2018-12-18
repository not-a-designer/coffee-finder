import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule }          from '@ionic/angular';

import { UserSettingsPage }     from './user-settings.page';
import { PipesModule }          from '@app-pipes/pipes.module'; 
import { AuthGuard }            from '@app-services/auth/auth.guard';


const routes: Routes = [
  { path: '', component: UserSettingsPage, canActivate: [AuthGuard] },];


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
