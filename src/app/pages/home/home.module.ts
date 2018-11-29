
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';

import { IonicModule }          from '@ionic/angular';

import { HomePage }             from '@app-pages/home/home.page';
import { PipesModule }          from '@app-pipes/pipes.module';


const routes: Routes = [{ path: '', component: HomePage }];


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    PipesModule
  ],

  declarations: [ HomePage ],

  exports: [ HomePage ],

  entryComponents: [ HomePage ]
})
export class HomePageModule {}
