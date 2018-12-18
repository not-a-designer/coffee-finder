import { Component, OnInit }                           from '@angular/core';
import { NgForm }                                      from '@angular/forms';
import { Router }                                      from '@angular/router';

import { AlertController,LoadingController, Platform } from '@ionic/angular';

import { AuthService, EMAIL_REGEXP, PASS_REGEXP }      from '@app-services/auth/auth.service';
import { UserService }                                 from '@app-services/user/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  public emailPattern: RegExp = EMAIL_REGEXP;
  public passwordPattern: RegExp = PASS_REGEXP;
  public passwordVisible: boolean = false;

  constructor(private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private platform: Platform, 
              private auth: AuthService,
              private users: UserService,
              private router: Router) { }

  public ngOnInit(): void {
  }

  public async googleLogin(): Promise<void> {
    try {
      const credential = (this.platform.is('cordova')) ? 
        await this.auth.googleLogin() :
        await this.auth.browserSocialLogin('google.com');

      if (credential.user) {
        console.log('user: ', credential.user);
        this.users.updateUser(credential.user);
        this.router.navigateByUrl('/tabs/settings');
      }
      else console.log('user error'); 
    }
    catch(e) { console.log('googleBrowserLogin() error: ', e.message) }
  }

  public async facebookLogin(): Promise<void> {
    try {
      const credential = (this.platform.is('cordova')) ?
        await this.auth.facebookLogin() :
        await this.auth.browserSocialLogin('facebook.com');
        
      if (credential.user) {
        console.log('user: ', credential.user);
        this.users.updateUser(credential.user);
        this.router.navigateByUrl('/tabs/settings');
      }
      else console.log('user error'); 
    }
    catch(e) { console.error('facebookLogin() error: ', e) }
  }

  public async twitterLogin(): Promise<void> {
    try {
      const credential = (this.platform.is('cordova')) ?
        await this.auth.twitterLogin() :
        await this.auth.browserSocialLogin('twitter.com');

      if (credential.user) {
        console.log('user: ', credential.user);
        this.users.updateUser(credential.user);
        this.router.navigateByUrl('/tabs/settings');
      }
      else console.log('user error'); 
    }
    catch(e) { console.error('twitterLogin() error: ', e)  }
  }

  public async emailLogin(form: NgForm): Promise<void> {
    let loader: HTMLIonLoadingElement;

    try {
      const email: string = form.value.email;
      const password: string = form.value.password;
      loader = await this.loadingCtrl.create({ message: 'Authenticating...', spinner: 'circles' });

      await loader.present();

      const credential = await this.auth.emailLogin(email, password);
      if (credential.user) {
        console.log('user: ', credential.user);
        this.users.updateUser(credential.user);
        loader.dismiss();
        this.router.navigateByUrl('/tabs/settings');
      }
    }
    catch(e) { 
      if (loader != undefined) loader.dismiss();
    }
  }

  public async showPasswordResetAlert(): Promise<void> {
    try {
      const alert = await this.alertCtrl.create({
        header: 'Reset Password',
        message: 'To reset your password, enter the your account email',
        inputs: [{
          type: 'email',
          name: 'email',
          placeholder: 'Email address'
        }],
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('cancel password reset')
        }, {
          text: 'Reset',
          handler: (async (data) => {
            try { 
              const loader = await this.loadingCtrl.create({ message: 'resetting...' })
              if (EMAIL_REGEXP.test(data.email)) {
                loader.dismiss();
                await this.auth.resetPassword(data.email);
                await this.showResetSuccessAlert(data.email);
              }
            }
            catch(e) { console.log('resetHandler error: ', e) }
          })
        }]
      });
      await alert.present();
    }
    catch(e) { console.error('doPasswordReset() error: ', e) }
  }

  public async showResetSuccessAlert(email: string): Promise<void> {
    try {
      const successAlert = await this.alertCtrl.create({
        header: 'Password Reset',
        message: `Please follow the link sent to ${email} to reset your password`,
        buttons: ['OK']
      });
      await successAlert.present();
    }
    catch(e) { console.log('passwordResetAlert() error: ', e) }
  }

  get isAndroid(): boolean { return this.platform.is('android') }

  public togglePasswordVisiblity(): void { this.passwordVisible = !this.passwordVisible }
}
