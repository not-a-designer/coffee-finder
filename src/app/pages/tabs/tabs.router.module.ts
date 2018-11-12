import { NgModule }                   from '@angular/core';
import { RouterModule, Routes }       from '@angular/router';

import { TabsPage }                   from '@app-pages/tabs/tabs.page';
import { HomePage }                   from '@app-pages/home/home.page';
import { UserSettingsPage }           from '@app-pages/user-settings/user-settings.page';
import { CoffeeMapPage }              from '@app-pages/coffee-map/coffee-map.page';
import { LoginPage }                  from '@app-pages/login/login.page';
import { RegisterPage }               from '@app-pages/register/register.page';
import { AuthGuard }                  from '@app-services/auth/auth.guard';
import { AuthResolveService }         from '@app-services/auth/auth-resolve.service';


const routes: Routes = [
  { 
    path: 'tabs', 
    component: TabsPage,
    children: [
      { path: '', redirectTo: '/tabs/(home:home)', pathMatch: 'full' },

      { path: 'map', outlet: 'map', component: CoffeeMapPage },

      { 
        path: 'settings', 
        outlet: 'settings', 
        component: UserSettingsPage, 
        canActivate: [ AuthGuard ], 
        resolve: { user: AuthResolveService } 
      },

      { path: 'login', outlet: 'settings', component: LoginPage },

      { path: 'register', outlet: 'settings', component: RegisterPage },

      { path: 'home', outlet: 'home', component: HomePage  }
    ]
  },
  { path: '', redirectTo: '/tabs/(home:home)', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
