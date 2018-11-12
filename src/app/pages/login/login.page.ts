import { Component, OnInit }         from '@angular/core';
import { Router }                    from '@angular/router';

import { AlertController, Platform } from '@ionic/angular';

import { AuthService }               from '@app-services/auth/auth.service';
import { UserService }               from '@app-services/user/user.service';


const EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASS_REGEXP: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email: string;
  public password: string;

  constructor(private platform: Platform, 
              private alertCtrl: AlertController,
              private auth: AuthService,
              private users: UserService,
              private router: Router) { }

  public ngOnInit(): void {
  }

  public async googleLogin() {
    try {
      if (this.platform.is('cordova')) {
        const credential = await this.auth.googleLogin();
        if (credential.user) {
          console.log('user: ', credential.user);
          this.router.navigate(['/']);
        }
        else console.log('user error'); 
      }
      else {
        const credential = await this.auth.browserSocialLogin('google');
        if (credential.user) {
          console.log('user: ', credential.user);
          this.users.updateUser(credential.user);
          this.router.navigateByUrl('/tabs/(map:map)');
        }
        else console.log('user error');
      }
    }
    catch(e) { console.log('googleBrowserLogin() error: ', e.message) }
  }

  public async doLogin(): Promise<void> {
    try {
      if (this.checkEmail(this.email)) {
        if (this.checkPassword(this.password)) {
          const credential = await this.auth.emailLogin(this.email, this.password);
          if (credential.user) {
            console.log('user: ', credential.user);
            this.users.updateUser(credential.user);
            this.router.navigateByUrl('/tabs/(map:map)');
          }
          else console.error('user error');
        }
        else {
          const errorMessage: string = 'Please re/enter a valid password';
          await this.showErrorAlert(errorMessage);
        }
      }
      else {
        const errorMessage: string = 'Please enter a valid email';
        await this.showErrorAlert(errorMessage);
      }
    }
    catch(e) { console.error('doLogin() error: ', e) }
  }

  private checkEmail(email: string): boolean {
    const e = email.trim();
    console.log('trimmed: ', e);

    if (e.length < 8) return false;
    else if (!EMAIL_REGEXP.test(e)) return false;
    else return true;
  }

  private checkPassword(password: string): boolean {
    const p: string = password.trim();
    console.log('trimmed: ', p);
    return PASS_REGEXP.test(p);
  }

  private async showErrorAlert(msg: string): Promise<void> {
    try {
      const errorAlert = await this.alertCtrl.create({
        header: 'Register Error',
        message: msg,
        buttons: ['OK']
      });
      await errorAlert.present();
    }
    catch(e) { console.error('showErrorAlert() error: ', e) }
    
  }

  get isAndroid(): boolean { return this.platform.is('android') }

}
