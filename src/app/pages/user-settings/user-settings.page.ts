
import { ChangeDetectorRef, Component, OnInit, NgZone}  from '@angular/core';
import { Router }                                       from '@angular/router';

import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';

import { Observable }                                   from 'rxjs';
import { take }                                         from 'rxjs/operators';

import * as moment                                      from 'moment'

import { AuthService }                                  from '@app-services/auth/auth.service';
import { ThemeService }                                 from '@app-services/theme/theme.service';
import { UserService }                                  from '@app-services/user/user.service';
import { User }                                         from '@app-interfaces/coffee-user';
import { Venue } from '@app-interfaces/foursquare/venue';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

  //public user: User = null;
  user: User;
  public changesSaved: boolean;
  public verifyMessageHidden: boolean;

  constructor(private router: Router, 
              private cdr: ChangeDetectorRef,
              private zone: NgZone,
              private platform: Platform, 
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private auth: AuthService, 
              public themes: ThemeService, 
              private users: UserService) { }

  public ngOnInit(): void  { 
      this.auth.user$.subscribe((user) => this.user = user);
      this.changesSaved = true;
  }

  public sendVerificationEmail(): void {
    this.auth.sendEmailVerification();
  }

  /*public toggleTheme(event?): void { 
    if (event) console.log(event);
    this.themes.toggleNextTheme();
  }*/

  public async showLogoutAlert(): Promise<void> {
    try {
      const logoutAlert = await this.alertCtrl.create({
        header: 'Confirm Logout',
        message: 'Are you sure you want to logout?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.zone.run(() => console.log('cancel logout'));
            }
          }, {
            text: 'Logout',
            handler: () => { 
              this.zone.run(() => this.doLogout());
            }
          }
        ]
      });
      await logoutAlert.present();
    }
    catch(e) { console.log('showLogoutAlert() error: ', e) }
  }

  public changesMade(event?): void { 
    if (event) console.log(event);
    this.changesSaved = false;
   }

  public async saveUser(): Promise<void> {
    try {
      const loader = await this.loadingCtrl.create({
        spinner: 'circles',
        message: 'Updating settings...',
        duration: 750
      });
      await loader.present();

      this.users.updateUserSettings(this.user);

      this.changesSaved = true;
      await this.router.navigateByUrl('/tabs/(map:map)');
      loader.dismiss();
    }
    catch(e) { console.log('saveUser() error: ', e) }
  }

  private async doLogout(): Promise<void> {
    try {
      const loader = await this.loadingCtrl.create({
        message: '',
        duration: 750,
        spinner: 'circles'
      });

      await loader.present();

      this.auth.logout();
      if (this.platform.is('cordova')) {
        this.auth.googleLogout();
        const fbStatus: string = await this.auth.getFbLoginStatus();
        if (fbStatus === 'connected') this.auth.facebookLogout();
      }
      await this.router.navigate(['/']);
      loader.dismiss();
    }
    catch(e) { console.log('doLogout() error: ', e) }
  }

  public async changePassword(): Promise<void> {
    try { await this.auth.verifyIdentityAlert('updatePassword') }
    catch(e) { console.log('changePassword() error: ', e) }
  }

  public async updateEmail(): Promise<void> {
    try { 
      await this.auth.verifyIdentityAlert('updateEmail');
      this.cdr.detectChanges();
  }
    catch(e) { console.log('updateEmail() error: ', e) }
  }

  public async showRemoveFavoriteAlert(): Promise<void> {
    try {
      const alert = await this.alertCtrl.create({
        header: 'remove Favorite',
        message: 'Are you sure you want to remove this location as your favorite?',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('cancel, keep favorite')
        }, {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            const prevLocation: Venue = this.user.favorite;
            this.user.favorite = null;
            this.users.updateUserSettings(this.user);
            this.showFavoriteToast(`${prevLocation.name} has been removed as your favorite!`);
          }
        }]
      });
      await alert.present();
    }
    catch(e) { console.log(e) }
  }

  private async showFavoriteToast(msg: string): Promise<void> {
    try {
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 2000,
        position: 'middle'
      });
      await toast.present();
    }
    catch(e) { console.log(e) }
  }

  /** HELPED GETTERS  **/
  get isAndroid(): boolean { return this.platform.is('android') }
  get maxAge(): string { return moment().subtract(18, 'years').format('YYYY-MM-DD') }
  get screenWidth(): number { return this.platform.width() }
}
