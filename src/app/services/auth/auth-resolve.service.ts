import { Injectable }                         from '@angular/core';
import { Resolve, ActivatedRouteSnapshot }    from '@angular/router';

import { LoadingController, ToastController } from '@ionic/angular';

import { Observable }                         from 'rxjs';

import { AuthService }                        from '@app-services/auth/auth.service';
import { CoffeeUser }                         from '@app-interfaces/coffee-user';

 
@Injectable({ providedIn: 'root' })
export class AuthResolveService implements Resolve<any> {
 
  constructor(private auth: AuthService, private loadingController: LoadingController, private toastCtrl: ToastController) { }
 
  resolve(route: ActivatedRouteSnapshot): Observable<CoffeeUser> | Promise<CoffeeUser> | CoffeeUser {
    let loading: HTMLIonLoadingElement;
 
    this.loadingController.create({ message: 'Loading user...', duration: 300, spinner: 'circles' })
        .then(async (res) => {
            loading = res;
            await loading.present();
        })
        .catch((error) => console.log('resolve error: ', error));
    
    return this.auth.user$;
  }
 
}