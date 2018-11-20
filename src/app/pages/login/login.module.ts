import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import { IonicModule }          from '@ionic/angular';

import { LoginPage }            from './login.page';


const routes: Routes = [{ path: '', component: LoginPage }];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],

  declarations: [ LoginPage ],

  entryComponents: [ LoginPage ],

  exports: [ LoginPage ]
})
export class LoginPageModule {}
