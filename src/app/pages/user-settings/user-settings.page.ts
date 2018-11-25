import { ChangeDetectorRef, 
         Component, 
         OnInit, 
         NgZone}                 from '@angular/core';
import { Router }                from '@angular/router';

import { AlertController, 
         LoadingController, 
         Platform, 
         ToastController, 
         ActionSheetController } from '@ionic/angular';

import { Observable }            from 'rxjs';
import { take }                  from 'rxjs/operators';

import * as firebase             from 'firebase/app';
import * as moment               from 'moment';

import { AuthService, 
         SOCIAL_MEDIA, 
         EMAIL_REGEXP, 
         PASS_REGEXP }           from '@app-services/auth/auth.service';
import { ThemeService }          from '@app-services/theme/theme.service';
import { UserService }           from '@app-services/user/user.service';
import { CoffeeUser }            from '@app-interfaces/coffee-user';
import { Venue }                 from '@app-interfaces/foursquare/venue';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

  //public user: User = null;
  
  user: CoffeeUser = null;
  linkedAccounts: Array<firebase.UserInfo> = [];
  unlinkedAccounts: Array<any> = [...SOCIAL_MEDIA];
  public changesSaved: boolean;
  public verifyMessageHidden: boolean;

  constructor(private router: Router, 
              private cdr: ChangeDetectorRef,
              private zone: NgZone,
              private platform: Platform, 
              private actionsheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private auth: AuthService, 
              public themes: ThemeService, 
              private users: UserService) { }

  public ngOnInit(): void  { 
      this.auth.user$.subscribe((user) => {
        console.log('user:', user);
        this.user = user;
        
        this.getRemainingProviders();
        
        
        //console.log(...this.unlinkedAccounts);
          
      //console.log(`CURRENT_ACCOUNT: ${this.user.currentProvider.providerId}`, this.user.currentProvider);
        //this.user.providerData.forEach((provider) => console.log(`LINKED-ACCOUNTS: ${provider.providerId}: `, provider));
        //this.unlinkedAccounts.forEach((account) => console.log(`UNLINKED-ACCOUNTS: ${account.providerId}:`, account));
      });
      this.changesSaved = true;
  }


  public async sendVerificationEmail(): Promise<void> {
    try {
      if (!this.user.emailVerified) {
        await this.auth.sendEmailVerification();
        await this.verificationEmailToast(this.user.email);
      }
    }
    catch(e) { console.log('sendVerificationEamil() error: ', e)}
  }

  private async verificationEmailToast(email: string): Promise<void> {
    try {
      console.log('verification email sent');
      const verifyToast = await this.toastCtrl.create({
        message: `Please check your ${email} inbox to verify you account`,
        position: 'middle',
        duration: 2500
      });
      await verifyToast.present();
    }
    catch(e) { console.log('verificationEmailToast() error: ', e) }
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

  public async showUnlinkAlert(event, providerId: string): Promise<void> {
    try { 
      const alert = await this.alertCtrl.create({
        header: 'Confirm Unlink',
        message: `Are you sure you want to unlink ${providerId} from this user?`,
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('cancel account unlink from ', providerId)
        }, {
          text: 'Unlink',
          role: 'destructive',
          handler: (async () => {
            try {
            }
            catch(err) { console.log(err) }
          })
        }]
      });
      await alert.present();
    }
    catch(e) { console.log(e) }
  }

  public async showLinkAccountAction(event): Promise<void> {
    try {
      console.log(event)
      this.getRemainingProviders();
      let buttonsArray: any[] = [];
      let emailButton: any;

      const cancelButton = {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => console.log('cancel account linking')
      };

      for (let acct of this.unlinkedAccounts) {
        if (acct.providerId !== 'password') {
          const button = {
            text: acct.label,
            icon: acct.icon,
            handler: (async () => {
              try { await this.showReauthenticationAlert('linkAccount', acct.providerId) }
              catch(e) { console.log(e) }
            })
          };
          buttonsArray.push(button);
        }
        else {
          emailButton = {
            text: acct.label,
            icon: acct.icon,
            handler: (async () => {
              try {await this.showReauthenticationAlert('linkEmail', 'password') }
              catch(e) { console.log(e) }
            })
          }
        }
      }

      if (emailButton) buttonsArray.push(emailButton);
      buttonsArray.push(cancelButton);
      console.log(...buttonsArray)

      const actionsheet = await this.actionsheetCtrl.create({
        header: 'Link account to',
        buttons: [...buttonsArray]
      });

      await actionsheet.present();
    }
    catch(e) { console.log(e) }
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

  private getRemainingProviders() {
    //SOCIAL_MEDIA.forEach((media) => console.log('SOC', media.label));
    this.unlinkedAccounts = [...SOCIAL_MEDIA];
    //this.unlinkedAccounts.forEach((acct) => console.log('reset', acct.providerId));
    for (let p of this.user.providerData) {
      const match = this.unlinkedAccounts.find((acct) => acct.providerId === p.providerId);
      if (match) {
        //console.log('remove ' + match.providerId);
        const index = this.unlinkedAccounts.indexOf(match);
        this.unlinkedAccounts.splice(index, 1);
      }
    }
    //this.unlinkedAccounts.forEach((acct) => console.log(acct.providerId));
  }


  public async showReauthenticationAlert(mode: string, providerId?: any): Promise<void> {
    try {
      const password = this.user.providerData.find((provider) => provider.providerId === 'password');
      let currentCredential;
      if (password) {
        const alert = await this.alertCtrl.create({
          header: 'Reauthtentication',

          message: 'Please re-enter your password',

          inputs: [{
            name: 'password',
            type: 'password',
            placeholder: 'Current password'
          }],

          buttons: [{
            text: 'Cancel',
            role: 'cancel',
            handler: () => console.log('password change cancelled')
          }, {
            text: 'Next',
            handler: (async (data) => {
              try {
                if (data.password) {
                  currentCredential = await this.auth.reauthenticateWithCredential(data.password);
                  if (currentCredential.user) {
                    switch(mode) {
                      case 'updateEmail': {
                        this.showUpdateEmailAlert();
                        break;
                      }
                      case 'updatePassword': {
                        this.showUpdatePasswordAlert();
                        break;
                      }
                      case 'linkAccount': {
                        this.linkAccount(providerId)
                        break;
                      }
                      case 'linkEmail': {
                        await this.showLinkEmailAlert();
                        break;
                      }
                      case 'unlinkAccount': {
                        await this.showUnlinkAccountAlert(providerId);
                        break;
                      }
                    }
                  }
                }
              }
              catch(e) { console.log(e) }
            })
          }]
        });
        await alert.present();
      }
      else {
        currentCredential = await this.auth.reauthenticateWithPopup(this.user.providerData[0].providerId);
        if (currentCredential.user) {
          switch(mode) {
            case 'updateEmail': {
              this.showUpdateEmailAlert()
              break;
            }
            case 'updatePassword': {
              this.showUpdatePasswordAlert();
              break;
            }
            case 'linkAccount': {
              this.linkAccount(providerId);
              break;
            }
            case 'linkEmail': {
              await this.showLinkEmailAlert();
              break;
            }
            case 'unlinkAccount': {
              await this.showUnlinkAccountAlert(providerId);
              break;
            }
          }
        }
      }
    }
    catch(e) { console.log(e) }
  }

  private async showLinkEmailAlert(): Promise<void> {
    try {
      const alert = await this.alertCtrl.create({
        header: 'Link Email',
        message: 'Enter new email and password',
        inputs: [{
          type: 'email',
          name: 'email',
          placeholder: 'Email'
        }, {
          type: 'password',
          name: 'password',
          placeholder: 'Password'
        }, {
          type: 'password',
          name: 'confirm',
          placeholder: 'Confirm password'
        }],
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => { console.log('cancel linking email') }
        }, {
          text: 'Link',
          handler: (async (data) => {
            if (data) {
              if (data.email && EMAIL_REGEXP.test(data.email)) {
                if (data.password && PASS_REGEXP.test(data.password)) {
                  if (data.confirm === data.password) {
                    const credential = await this.auth.linkEmail(data.email, data.password);
                    if (credential.user) {
                      this.users.updateUser(credential.user);
                    }
                  }
                  else console.log('password confirmation does not match password')
                }
                else console.log('please enter a valid password')
              }
              else console.log('please enter avalid email')
            }
            else console.log('please enter and email and password, and confirm')
          })
        }]
      });
      await alert.present();
    }
    catch(e) { console.log(e) }
  }

  private async showUpdateEmailAlert(): Promise<void> {
    try {
      const alert = await this.alertCtrl.create({
        header: 'Update Email',
        message: 'Enter new email address',
        inputs: [{
          name: 'email',
          type: 'email',
          placeholder: 'New email'
        }],
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('cancel update email')
        }, {
          text: 'Update',
          handler: (async (data) => {
            try {
              if (data.email && EMAIL_REGEXP.test(data.email)) this.auth.updateEmail(data.email);
            }
            catch(e) { console.log(e.code) }
          })
        }]
      });
      await alert.present();
    }
    catch(e) { console.log(e.code) }
  }

  private async showUnlinkAccountAlert(providerId: string): Promise<void> {
    try {
      const alert = await this.alertCtrl.create({
        header: 'Confirm Unlink',
        message: `Are you sure you want to unlink ${ providerId === 'password' ? this.user.email : providerId.slice(0, -4) } from this user?`,
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('cancel account unlink from ', providerId)
        }, {
          text: 'Unlink',
          role: 'destructive',
          handler: (async () => {
            try { 
              const updatedUser = await this.auth.unlinkAccount(providerId);
              if (updatedUser.uid) this.users.updateUser(updatedUser);
            }
            catch(err) { console.log(err) }
          })
        }]
      });
      await alert.present();
    }
    catch(e) { console.log(e) }
  }

  private async showUpdatePasswordAlert(): Promise<void> {
    try {
      const alert = await this.alertCtrl.create({
        header: 'Change Password',
        message: 'Enter new password',
        inputs: [{
          name: 'password',
          type: 'password',
          placeholder: 'New password',
        }, {
          name: 'confirm',
          type: 'password',
          placeholder: 'Confirm password',
        }],
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('cancel password change')
        }, {
          text: 'Confirm',
          handler: (async (data) => {
            try {
              if (data.password && data.confirm) {
                if (PASS_REGEXP.test(data.password)) {
                  if (data.password === data.confirm) {
                    await this.auth.updatePassword(data.password);
                  }
                  else console.log('confirmation does not match the new password');
                }
                else console.log('Please enter a valid new password (min 6 char, at least 1 capital and 1 number)');
              }
              else console.log('Please enter a valid password/confirmation password');
            }
            catch(e) { console.log(e.code) }
          })
        }]
      });
      await alert.present();
    }
    catch(e) { console.log(e.code) }
  }
  
  private async linkAccount(providerId: string) {
    try {
      const credential = await this.auth.linkAccount(providerId);
      if (credential.user) {
        this.users.updateUser(credential.user);
        this.getRemainingProviders();
      }
    }
    catch(e) { console.log(e) }
  }

  /** HELPED GETTERS  **/
  get isAndroid(): boolean { return this.platform.is('android') }

  get isPasswordProvider(): boolean { 
    let passCheck: boolean = false
    for (let provider of this.user.providerData) {
      if (provider.providerId === 'password') passCheck = true;
    }
    return passCheck;
  }
  get maxAge(): string { return moment().subtract(18, 'years').format('YYYY-MM-DD') }
  get screenWidth(): number { return this.platform.width() }
}
