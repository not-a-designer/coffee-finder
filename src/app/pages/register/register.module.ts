import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import { IonicModule }          from '@ionic/angular';

import { RegisterPage }         from './register.page';


const routes: Routes = [{ path: '', component: RegisterPage }];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],

  declarations: [ RegisterPage ],

  entryComponents: [ RegisterPage ],

  exports: [ RegisterPage ]
})
export class RegisterPageModule {}
