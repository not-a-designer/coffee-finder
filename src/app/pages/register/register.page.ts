import { Component, OnInit }         from '@angular/core';
import { Router }                    from '@angular/router';

import { AlertController, Platform } from '@ionic/angular';

import { AuthService }               from '@app-services/auth/auth.service';
import { UserService }               from '@app-services/user/user.service';


const EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASS_REGEXP: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public email: string;
  public password: string;
  public confirm: string;

  constructor(private router: Router, 
              private alertCtrl: AlertController, 
              private platform: Platform,
              private auth: AuthService,
              private users: UserService) { }

  public ngOnInit(): void {
  } 

  public async doRegister(): Promise<void> {
    try {
      if (this.checkEmail(this.email)) {
        if (this.checkPassword(this.password, this.confirm)) {
          const credential = await this.auth.emailRegister(this.email, this.password);
          if (credential.user) {
            console.log('user: ', credential.user);
            this.users.updateUser(credential.user);
            this.router.navigateByUrl('/tabs/(map:map)');
          }
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
    catch(e) { console.error('doRegister() error: ', e) }
  }

  private checkEmail(email: string): boolean {
    const e: string = email.trim();
    console.log('trimmed: ', e)

    if (email.length < 8) return false;
    else if (!EMAIL_REGEXP.test(e)) return false;
    else return true;
  }

  private checkPassword(password: string, confirm: string): boolean {
    const p: string = password.trim();
    const c: string = confirm.trim();
    console.log('trimmed: ', {p, c})

    if (!PASS_REGEXP.test(p)) return false;
    else if (c !== p) return false;
    else return true;
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
