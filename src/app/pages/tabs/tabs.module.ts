import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';

import { IonicModule }                      from '@ionic/angular';

import { AgmCoreModule }                    from '@agm/core';
import { AgmSnazzyInfoWindowModule}         from '@agm/snazzy-info-window';

import { TabsPageRoutingModule }            from './tabs.router.module';

import { TabsPage }                         from './tabs.page';
import { HomePageModule }                   from '@app-pages/home/home.module';
import { UserSettingsPageModule }           from '@app-pages/user-settings/user-settings.module';
import { CoffeeMapPageModule }              from '@app-pages/coffee-map/coffee-map.module';
import { environment }                      from '@environments/environment';
import { LoginPageModule }                  from '@app-pages/login/login.module';
import { RegisterPageModule }               from '@app-pages/register/register.module';
import { PrivacyPageModule }                from '@app-pages/privacy/privacy.module';
import { TosPageModule }                    from '@app-pages/tos/tos.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    AgmCoreModule.forRoot({ apiKey: environment.firebase.apiKey }),
    AgmSnazzyInfoWindowModule,
    HomePageModule,
    CoffeeMapPageModule,
    UserSettingsPageModule,
    LoginPageModule,
    RegisterPageModule,
    PrivacyPageModule,
    TosPageModule
  ],

  declarations: [ TabsPage ],

  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class TabsPageModule {}
