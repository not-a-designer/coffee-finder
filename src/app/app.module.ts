import { NgModule, CUSTOM_ELEMENTS_SCHEMA }    from '@angular/core';
import { AngularFireModule }                   from '@angular/fire';
import { AngularFireAuthModule }               from '@angular/fire/auth';
import { AngularFirestoreModule }              from '@angular/fire/firestore';
import { BrowserModule }                       from '@angular/platform-browser';
import { RouteReuseStrategy }                  from '@angular/router';

import { IonicModule, IonicRouteStrategy }     from '@ionic/angular';
import { AdMobFree }                           from '@ionic-native/admob-free/ngx';
import { Facebook }                            from '@ionic-native/facebook/ngx';
import { Geolocation }                         from '@ionic-native/geolocation/ngx';
import { GooglePlus }                          from '@ionic-native/google-plus/ngx';
import { SplashScreen }                        from '@ionic-native/splash-screen/ngx';
import { StatusBar }                           from '@ionic-native/status-bar/ngx';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { environment }                         from '@environments/environment'
import { AppRoutingModule }                    from './app-routing.module';
import { ComponentsModule }                    from '@app-components/components.module';
import { PipesModule }                         from '@app-pipes/pipes.module';
import { AppComponent }                        from './app.component';
import { AuthService }                         from '@app-services/auth/auth.service';
import { AuthGuard }                           from '@app-services/auth/auth.guard';
import { MapService }                          from '@app-services/map/map.service';
import { ThemeService }                        from '@app-services/theme/theme.service';
import { UserService }                         from '@app-services/user/user.service';


@NgModule({
  declarations: [ AppComponent ],

  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({ apiKey: environment.firebase.apiKey }),
    ComponentsModule,
    PipesModule
  ],

  providers: [
    AdMobFree,
    AuthService,
    AuthGuard,
    Facebook,
    Geolocation,
    GoogleMapsAPIWrapper,
    GooglePlus,
    MapService,
    StatusBar,
    SplashScreen,
    ThemeService,
    UserService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  
  bootstrap: [ AppComponent ],

  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
