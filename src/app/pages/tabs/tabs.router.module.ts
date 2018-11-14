import { NgModule }                   from '@angular/core';
import { RouterModule, Routes }       from '@angular/router';

import { TabsPage }                   from '@app-pages/tabs/tabs.page';
import { HomePage }                   from '@app-pages/home/home.page';
import { UserSettingsPage }           from '@app-pages/user-settings/user-settings.page';
import { CoffeeMapPage }              from '@app-pages/coffee-map/coffee-map.page';
import { LoginPage }                  from '@app-pages/login/login.page';
import { RegisterPage }               from '@app-pages/register/register.page';
import { PrivacyPage }                from '@app-pages/privacy/privacy.page';
import { TosPage }                    from '@app-pages/tos/tos.page';
import { AuthGuard }                  from '@app-services/auth/auth.guard';
import { AuthResolveService }         from '@app-services/auth/auth-resolve.service';


const routes: Routes = [
  //tabs root
  { 
    path: 'tabs', 
    component: TabsPage,
    children: [
      //home tab
      { path: 'home', outlet: 'home', component: HomePage  },
      //map tab
      { path: 'map', outlet: 'map', component: CoffeeMapPage },

      //main settings tab
      { 
        path: 'settings', 
        outlet: 'settings', 
        component: UserSettingsPage, 
        canActivate: [ AuthGuard ], 
        //resolve: { user: AuthResolveService } 
      },

      //auth tabs
      { path: 'login', outlet: 'settings', component: LoginPage },
      { path: 'register', outlet: 'settings', component: RegisterPage },

      //legal tabs
      { path: 'privacy', outlet: 'settings', component: PrivacyPage },
      { path: 'tos', outlet: 'settings', component: TosPage },

      //redirect
      { path: '', redirectTo: '/tabs/(home:home)', pathMatch: 'full' },
    ]
  },

  //redirect 
  { path: '', redirectTo: '/tabs/(home:home)', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
