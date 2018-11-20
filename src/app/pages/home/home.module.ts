import { IonicModule }          from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { FormsModule }          from '@angular/forms';
import { HomePage }             from '@app-pages/home/home.page';


const routes: Routes = [{ path: '', component: HomePage }];


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],

  declarations: [ HomePage ],

  exports: [ HomePage ],

  entryComponents: [ HomePage ]
})
export class HomePageModule {}
