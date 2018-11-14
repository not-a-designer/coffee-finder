
import { ChangeDetectorRef, Component, OnInit, NgZone}  from '@angular/core';
import { Router, ActivatedRoute }                       from '@angular/router';

import { AlertController, LoadingController, Platform } from '@ionic/angular';

import { Observable }                                   from 'rxjs';

import * as moment                                      from 'moment'

import { AuthService }                                  from '@app-services/auth/auth.service';
import { ThemeService }                                 from '@app-services/theme/theme.service';
import { UserService }                                  from '@app-services/user/user.service';
import { User }                                         from '@app-interfaces/coffee-user';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

  //public user: User = null;
  user$: Observable<User>;
  public changesSaved: boolean;
  public verifyMessageHidden: boolean;

  constructor(private router: Router, 
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private zone: NgZone,
              private platform: Platform, 
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private auth: AuthService, 
              public themes: ThemeService, 
              private users: UserService) { }

  public /*async */ngOnInit(): /*Promise<*/void/*>*/  { 
    //try {
      //this.user = this.route.snapshot.data['user'];
      this.user$ = this.auth.user$;
    
      this.changesSaved = true;
      //console.log(this.user)
      //const twUser = await this.auth.getTwitterScreenname();
    /*}
    catch(e) { console.log('onInit() error :', e)}*/
  }

  public ionViewWillEnter() {
    //this.verifyMessageHidden = this.user.emailVerified;
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
      await loader.present()

      this.user$.forEach((user) => this.users.updateUserSettings(user));

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

  public async changePassword() {
    try { await this.auth.verifyIdentityAlert('updatePassword') }
    catch(e) { console.log('changePassword() error: ', e) }
  }

  public async updateEmail() {
    try { 
      await this.auth.verifyIdentityAlert('updateEmail');
      this.cdr.detectChanges();
  }
    catch(e) { console.log('updateEmail() error: ', e) }
  }

  /** HELPED GETTERS  **/
  get isAndroid(): boolean { return this.platform.is('android') }
  get maxAge(): string { return moment().subtract(18, 'years').format('YYYY-MM-DD') }
  get screenWidth(): number { return this.platform.width() }
}
