import { Injectable }                         from '@angular/core';
import { Resolve, ActivatedRouteSnapshot }    from '@angular/router';

import { LoadingController, ToastController } from '@ionic/angular';

import { Observable }                         from 'rxjs';
import { take, tap }                          from 'rxjs/operators';

import { AuthService }                        from '@app-services/auth/auth.service';
import { User }                               from '@app-interfaces/coffee-user';

 
@Injectable({ providedIn: 'root' })
export class AuthResolveService implements Resolve<any> {
 
  constructor(private auth: AuthService, private loadingController: LoadingController, private toastCtrl: ToastController) { }
 
  resolve(route: ActivatedRouteSnapshot): Observable<User> | Promise<User> | User {
    let loading: HTMLIonLoadingElement;
 
    this.loadingController.create({ message: 'Loading user...', duration: 300, spinner: 'circles' })
        .then(async (res) => {
            loading = res;
            await loading.present();
        })
        .catch((error) => console.log('resolve error: ', error));
    
    return this.auth.user$;
    /*return this.auth.user$.pipe(
        take(1),
        tap(async (user: User) => {
            try {
                console.log('user found');
                const userToast = await this.toastCtrl.create({
                    message: `Logged in with ${user.displayName ? user.displayName : user.email}`,
                    duration: 2000,
                    position: 'middle'
                });
                await userToast.present();
            }
            catch(e) { console.log('resolve() error: ', e) }
        })
    );*/
  }
 
}