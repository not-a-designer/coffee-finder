import { IonicModule }  from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { HomePage }     from '@app-pages/home/home.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],

  declarations: [ HomePage ],

  exports: [ HomePage ],

  entryComponents: [ HomePage ]
})
export class HomePageModule {}
