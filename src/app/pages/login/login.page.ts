import { Component, OnInit }           from '@angular/core';
import { NgForm }                      from '@angular/forms';
import { Router }                      from '@angular/router';

import { LoadingController, Platform } from '@ionic/angular';

import { AuthService, EMAIL_REGEXP, PASS_REGEXP } from '@app-services/auth/auth.service';
import { UserService }                 from '@app-services/user/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public emailPattern: RegExp = EMAIL_REGEXP;
  public passwordPattern: RegExp = PASS_REGEXP;
  public passwordVisible: boolean = false;

  constructor(private loadingCtrl: LoadingController,
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
        await this.auth.browserSocialLogin('google');

      if (credential.user) {
        console.log('user: ', credential.user);
        this.users.updateUser(credential.user);
        this.router.navigateByUrl('/tabs/(settings:settings)');
      }
      else console.log('user error'); 
    }
    catch(e) { console.log('googleBrowserLogin() error: ', e.message) }
  }

  public async facebookLogin(): Promise<void> {
    try {
      const credential = (this.platform.is('cordova')) ?
        await this.auth.facebookLogin() :
        await this.auth.browserSocialLogin('facebook');
        
      if (credential.user) {
        console.log('user: ', credential.user);
        this.users.updateUser(credential.user);
        this.router.navigateByUrl('/tabs/(settings:settings)');
      }
      else console.log('user error'); 
    }
    catch(e) { console.error('facebookLogin() error: ', e) }
  }

  public async twitterLogin(): Promise<void> {
    try {
      const credential = (this.platform.is('cordova')) ?
        await this.auth.twitterLogin() :
        await this.auth.browserSocialLogin('twitter');

      if (credential.user) {
        console.log('user: ', credential.user);
        this.users.updateUser(credential.user);
        this.router.navigateByUrl('/tabs/(settings:settings)');
      }
      else console.log('user error'); 
    }
    catch(e) { console.error('twitterLogin() error: ', e)  }
  }

  public async doLogin(form: NgForm): Promise<void> {
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
        this.router.navigateByUrl('/tabs/(settings:settings)');
      }
    }
    catch(e) { 
      if(loader != undefined) loader.dismiss();
      //console.log('doLogin() error: ', e);
    }
  }

  public async doPasswordReset() {
    try { await this.auth.showResetPasswordAlert() }
    catch(e) { console.error('doPasswordReset() error: ', e) }
  }

  get isAndroid(): boolean { return this.platform.is('android') }

  public togglePasswordVisiblity(): void { this.passwordVisible = !this.passwordVisible }
}
