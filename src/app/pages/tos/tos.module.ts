import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import { IonicModule }          from '@ionic/angular';

import { TosPage }              from './tos.page';


const routes: Routes = [{ path: '', component: TosPage }];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],

  declarations: [TosPage],

  exports: [ TosPage ],

  entryComponents: [ TosPage ]
})
export class TosPageModule {}
