import { Injectable }      from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AlertController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus }      from '@ionic-native/google-plus/ngx';

import { Observable, of }  from 'rxjs';
import { switchMap }       from 'rxjs/operators';

import * as firebase       from 'firebase/app';

import { environment }     from '@environments/environment';
import { UserService }     from '@app-services/user/user.service';
import { User }            from '@app-interfaces/coffee-user';


export const EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASS_REGEXP: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public firebaseUser$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, 
              private fb: Facebook,
              private gPlus: GooglePlus,
              private users: UserService,
              private alertCtrl: AlertController) { 
    this.firebaseUser$ = this.afAuth.authState;
  }

  public isLoggedIn(): Observable<firebase.User> { return this.afAuth.authState }

  get user$(): Observable<User> { 
    return this.firebaseUser$.pipe(
        switchMap((u: firebase.User) => {
          if (u) return this.users.getUser(u.uid);
          else return of(null);
        })
    );
  }

  /** AngularFire logout() **/
  public logout() { this.afAuth.auth.signOut() }

  public async showResetPasswordAlert() {
    try {
      const resetAlert = await this.alertCtrl.create({
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
          handler: async (data) => {
            if (EMAIL_REGEXP.test(data.email)) await this.resetPassword(data.email);
          }
        }]
      });

      await resetAlert.present();
    }
    catch(e) {  }
  }

  private async resetPassword(email: string) {
    try { 
      const actionCodes: firebase.auth.ActionCodeSettings = {
        url: 'local-coffee-finder-dev.firebaseapp.com',
        iOS: { bundleId: 'com.spectral.localcoffeefinder' },
        android: { packageName: 'com.spectral.localcoffeefinder' }
      };

      return await this.afAuth.auth.sendPasswordResetEmail(email);
    }
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e.code);
      console.error('resetPassword() error: ', e) 
    }
  }

  /** AngularFire signInWithEmailAndPassword() **/
  public async emailLogin(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try { return await this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password) }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e.code);
      console.log('emailLogin() error: ', e) 
    }
  }

  /** AngularFire createUserWithEmailAndPassword() **/
  public async emailRegister(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try { return await this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(email, password) }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e.code);
      console.log('emailRegister() error: ', e) }
  }

  /** Ionic Native googleLogin() **/
  public async googleLogin(): Promise<firebase.auth.UserCredential> {
    try {
      const gPlusCredentials = {
        'WebClientId': environment.gPlusClientId,
        'offline': true,
        'scopes': 'profile email'
      };

      const gPlusUser = await this.gPlus.login(gPlusCredentials);
      const credential = firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken);
      return await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential)
    }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e.code);
      console.log('native googleLogin() error: ', e) 
    }
  }

  public async facebookLogin(): Promise<firebase.auth.UserCredential> {
    try {
      const fbLoginRes: FacebookLoginResponse = await this.fb.login(['email', 'public_profile', 'user_friends']);
      if (fbLoginRes.status === 'connected') {
        console.log('res: ', fbLoginRes.authResponse);
        const credential = firebase.auth.FacebookAuthProvider.credential(fbLoginRes.authResponse.accessToken)
        return await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
      }
    }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e.code);
      console.error('native Facebook login error: ', e) 
    }
  }

  public async getFbLoginStatus() { return await this.fb.getLoginStatus() }


  /** Ionic native googleLogout() **/
  public googleLogout() { this.gPlus.logout() }

  public facebookLogout() { this.fb.logout() }

  /** AngularFire signInWithPopup() **/
  public async browserSocialLogin(network: string): Promise<firebase.auth.UserCredential> {
    try {
      const provider = this.determineProvider(network);
      return await this.afAuth.auth.signInWithPopup(provider);
    }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e.code);
      console.log('browserSocialLogin() error: ', e) 
    }
  }

  /** helper functions **/
  private determineProvider(provider: string): firebase.auth.AuthProvider {
    switch(provider) {
      case 'facebook': return new firebase.auth.FacebookAuthProvider();
      case 'twitter': return new firebase.auth.TwitterAuthProvider();
      //Default to google provider
      default: return new firebase.auth.GoogleAuthProvider();
    }
  }

  private async showErrorAlert(errorCode: string): Promise<void> {
    try {
      let msg: string;
      switch(errorCode) {
        /** REGISTRATION ERRORS */
        case 'auth/email-already-in-use': {
          msg = 'This email is already in use, try logging in'
          break;
        }
        case 'auth/weak-password': {
          msg = 'This password is too weak, please try again'
          break;
        }

        /** GENERAL AUTH ERRORS */
        case 'auth/account-exists-with-different-credential': {
          msg = 'This account already exists with a different credential, please try again';
          break;
        }
        case 'auth/wrong-password': {
          msg = 'Password is incorrect, please try again';
          break;
        }
        case 'auth/operation-not-allowed': {
          msg = 'You are unauthorized to make this operation, please try again';
          break;
        }
        case 'auth/invalid-email': {
          msg = 'Please enter a valid email';
          break;
        }
        case 'auth/user-disabled': {
          msg = 'This user has been disabled, please try again';
          break;
        }
        case 'auth/user-not-found': {
          msg = 'There is no user connected to this email, you may want to register';
          break;
        }
      }
      const errorAlert = await this.alertCtrl.create({
        header: 'Login Error',
        message: msg,
        buttons: ['OK']
      });
      await errorAlert.present();
    }
    catch(e) { console.error('showErrorAlert() error: ', e) }
  }
}
