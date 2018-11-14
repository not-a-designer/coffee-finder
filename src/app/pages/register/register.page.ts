import { Component, OnInit }           from '@angular/core';
import { NgForm }                      from '@angular/forms';
import { Router }                      from '@angular/router';

import { LoadingController, Platform } from '@ionic/angular';

import { AuthService, EMAIL_REGEXP, PASS_REGEXP } from '@app-services/auth/auth.service';
import { UserService }                 from '@app-services/user/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public emailPattern: RegExp = EMAIL_REGEXP;
  public passwordPattern: RegExp = PASS_REGEXP;
  public passwordVisible: boolean = false;

  constructor(private router: Router, 
              private loadingCtrl: LoadingController, 
              private platform: Platform,
              private auth: AuthService,
              private users: UserService) { }

  public ngOnInit(): void {
  } 

  public async doRegister(form: NgForm): Promise<void> {
    let loader: HTMLIonLoadingElement;
    try {
      loader = await this.loadingCtrl.create({
        message: 'Creating new user...',
        spinner: 'circles'
      });
  
      await loader.present();

      const email = form.value.email;
      const password = form.value.password;
      const credential = await this.auth.emailRegister(email, password);
      if (credential.user) {
        if (!credential.user.emailVerified) this.auth.sendEmailVerification();
        console.log('user: ', credential.user);
        this.users.updateUser(credential.user);
        loader.dismiss();
        this.router.navigateByUrl('/tabs/(map:map)');
      }
    }
    catch(e) { if (loader != undefined) loader.dismiss() }
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


  get isAndroid(): boolean { return this.platform.is('android') }

  public togglePasswordVisiblity(): void { this.passwordVisible = !this.passwordVisible }
}
