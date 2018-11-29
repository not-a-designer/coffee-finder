import { Injectable }                             from '@angular/core';
import { AngularFireAuth }                        from '@angular/fire/auth';

import { AlertController, 
         LoadingController,
         Platform,
         ToastController }                        from '@ionic/angular';
import { Facebook, FacebookLoginResponse }        from '@ionic-native/facebook/ngx';
import { GooglePlus }                             from '@ionic-native/google-plus/ngx';
import { TwitterConnect, TwitterConnectResponse } from '@ionic-native/twitter-connect/ngx';

import { Observable, of }                         from 'rxjs';
import { switchMap }                              from 'rxjs/operators';

import * as firebase                              from 'firebase/app';

import { environment }                            from '@environments/environment';
import { UserService }                            from '@app-services/user/user.service';
import { CoffeeUser }                             from '@app-interfaces/coffee-user';


export const EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASS_REGEXP: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
export const SOCIAL_MEDIA: Array<{label: string; providerId: string; icon: string}> = [
  { label: 'Facebook', providerId: 'facebook.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/F_icon.svg' }, 
  { label: 'Email', providerId: 'password', icon: 'mail' },
  { label: 'Google', providerId: 'google.com', icon: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' },
  { label: 'Twitter', providerId: 'twitter.com', icon: 'https://upload.wikimedia.org/wikipedia/fr/c/c8/Twitter_Bird.svg' }
];

interface TwitterUserData {
  user_id: string|number;
  screen_name: string;
  include_entities: boolean;
}


@Injectable({ providedIn: 'root' })
export class AuthService {

  public firebaseUser$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, 
              private fb: Facebook,
              private gPlus: GooglePlus,
              private twitter: TwitterConnect,
              private users: UserService,
              private alertCtrl: AlertController,
              private platform: Platform,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) { 
    this.firebaseUser$ = this.isLoggedIn();
  }
  /*********************************************************************/
  /**                          PUBLIC METHODS                         **/
  /*********************************************************************/

  /** 
   * @public IsLoggedIn()
   * @returns Observable<firebase.User>
   */
  public isLoggedIn(): Observable<firebase.User> { return this.afAuth.authState }

  /** 
   * @public user$ 
   * @returns Observable<User>
   */
  get user$(): Observable<CoffeeUser> { 
    return this.firebaseUser$.pipe(
        switchMap((u: firebase.User) => {
          if (u) return this.users.getUser(u.uid);
          else return of(null);
        })
    );
  }
  /*********************************************************************/
  /**                         SIGNOUT METHODS                         **/
  /*********************************************************************/

  /** 
   * @public logout() 
   * - log user out from AngularFireAuth
   */
  public logout(): void { this.afAuth.auth.signOut() }

  /** 
   * @public googleLogout() 
   * - uses ionic-native method to logout of GooglePlus
   */
  public googleLogout(): void { 
    this.gPlus.logout() }

  /**
   * @public facebookLogout()
   * - uses ionic-native method to logout of Facebook
   */
  public facebookLogout(): void { this.fb.logout() }

  /**
   * @public twitterLogout()
   * - uses ionic-native method to logout of Twitter
   */
  public twitterLogout(): void { this.twitter.logout() }


  
  /*********************************************************************/
  /**                          LOGIN METHODS                          **/
  /*********************************************************************/

  /** 
   * @public emailLogin()
   * - attempts to sign in with AngularFireAuth signInAndRetrieveDataWithEmailAndPassword()
   * @param email string
   * @param password string
   * @returns Promise<firebase.auth.UserCredential>
   */
  public async emailLogin(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try { return await this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password) }
    catch(e) { 
      console.log(e.code);
      this.showErrorAlert(e);
      console.log('emailLogin() error: ', e) 
    }
  }

  /** 
   * @public emailRegister()
   * - attempts to create user with AngularFireAuth createUserAndRetrieveDataWithEmailAndPassword()
   * @param email string
   * @param password string
   * @returns Promise<firebase.auth.UserCredential>
   */
  public async emailRegister(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try { return await this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(email, password) }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('emailRegister() error: ', e) }
  }

  /** 
   * @public googleLogin()
   * - creates GooglePlus credential
   * - attempts to login in with credential via ionic-native GooglePlus 
   * - if successful, returns a firebase authentication credential
   * @returns Promise<firebase.auth.UserCredential>
   */
  public async googleLogin(): Promise<firebase.auth.UserCredential> {
    try {
      await this.platform.ready()
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
      await this.showErrorAlert(e);
      console.log('native googleLogin() error: ', e) 
    }
  }

  /** 
   * @public facebookLogin()
   * - attempts to login in via ionic-native Facebook 
   * - check FacebookLoginResponse if 'connected'
   * - if successful, returns a firebase authentication credential
   * @returns Promise<firebase.auth.UserCredential>
   */
  public async facebookLogin(): Promise<firebase.auth.UserCredential> {
    try {
      const res: FacebookLoginResponse = await this.fb.login(['email', 'public_profile', 'user_friends']);
      if (res.status === 'connected') {
        const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
      }
    }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e);
      console.error('native Facebook login error: ', e) 
    }
  }

  /**
   * @public getFbLoginStatus()
   * @returns Promise<FacebookLoginResponse>
   */
  public async getFbLoginStatus(): Promise<string> { return await this.fb.getLoginStatus() }

  /** 
   * @public twitterLogin()
   * - retrieves login response and attpemts to login via ionic-native TwitterConnect
   * @returns Promise<firebase.auth.UserCredential>
   */  
  public async twitterLogin() {
    try {
      const res: TwitterConnectResponse = await this.twitter.login();
      const credential = firebase.auth.TwitterAuthProvider.credential(res.token, res.secret);
      return await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
    }
    catch(e) { 
      console.log(e.code)
      this.showErrorAlert(e);
      console.log('twitterLogin() error: ', e) }
  }

  /** 
   * @public browserSocialLogin()
   * - calls determinProvider() to get firebase.auth.AuthProvider
   * - use provideer to attempt login via signInWithPopup()
   * - if successful, returns a firebase authentication credential
   *  @returns Promise<firebase.auth.UserCredential>
   */
  public async browserSocialLogin(providerId: string): Promise<firebase.auth.UserCredential> {
    try {
      const provider = this.determineProvider(providerId);
      return await this.afAuth.auth.signInWithPopup(provider);
    }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('browserSocialLogin() error: ', e) 
    }
  }


  /*********************************************************************/
  /**                          ALERT METHODS                          **/
  /*********************************************************************/
  public async reauthenticateWithCredential(password: string): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(
        firebase.auth.EmailAuthProvider.credential(this.afAuth.auth.currentUser.email, password));
      }
      catch(e) {
        console.log(e.code);
        await this.showErrorAlert(e);
        console.log('reauthenticationWithCredential() error: ', e);
      }
    }


  public async reauthenticateWithPopup(providerId: string): Promise<firebase.auth.UserCredential> {
    try {
      const provider = this.determineProvider(providerId);
      return await this.afAuth.auth.currentUser.reauthenticateWithPopup(provider);
    }
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('reauthenticateWithPopup() error: ', e);
    }
  }

  /**
   * @public resetPassword()
   * - used by showResetPasswordAlert() to send email when the Alert is confirmed
   * @param email 
   * @returns Promise<void>
   */
  public async resetPassword(email: string): Promise<void> {
    try { 
      /*const actionCodes: firebase.auth.ActionCodeSettings = {
        url: 'local-coffee-finder-dev.firebaseapp.com',
        iOS: { bundleId: 'com.spectral.localcoffeefinder' },
        android: { packageName: 'com.spectral.localcoffeefinder' }
      };*/
      return await this.afAuth.auth.sendPasswordResetEmail(email);
    }
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e);
      console.error('resetPassword() error: ', e) 
    }
  }
  

  /**
   * @public sendEmailVerification()
   * @param user firebase.User
   * @returns Promise<void>
   */
  public async sendEmailVerification(): Promise<void> {
    try { return await this.afAuth.auth.currentUser.sendEmailVerification() }
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('sendEmailVerification() error: ', e);
    }
  }

  public async linkAccount(providerId: string) {
    try {
      const currentUser = this.afAuth.auth.currentUser;
      const provider = this.determineProvider(providerId);
      return await currentUser.linkWithPopup(provider);
    }
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('linkAccount() error: ', e);
    }
  }

  public async linkEmail(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      const currentUser = this.afAuth.auth.currentUser;
      const emailCredential = firebase.auth.EmailAuthProvider.credential(email, password);
      return await currentUser.linkAndRetrieveDataWithCredential(emailCredential);
    }
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('linkEmail() error: ', e);
    }
  }

  public async unlinkAccount(providerId: string): Promise<firebase.User> {
    try {
      const currentUser = this.afAuth.auth.currentUser;
      return await currentUser.unlink(providerId);     
    }
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('unlinkAccount() error: ', e);
    }
  }

  public async updatePassword(newPassword: string): Promise<void> {
    try { await this.afAuth.auth.currentUser.updatePassword(newPassword) }
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('updatePassword() error: ', e);
    }
  }

  public async updateEmail(newEmail: string): Promise<void> {
    try {
      const currentUser = this.afAuth.auth.currentUser
      await this.afAuth.auth.currentUser.updateEmail(newEmail);
      this.users.updateUser(currentUser);
      this.successToast('Email was successfully updated');
    }  
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('updateEmail() error: ', e);
    }
  }


  /*********************************************************************/
  /**                         PRIVATE METHODS                         **/
  /*********************************************************************/
  /**
   * @public determineProvider()
   * - used by browserSocialLogin() to get appropriate AuthProvider
   * @param provider string
   * @returns firebase.auth.AuthProvider
   */
  private determineProvider(providerId: string): firebase.auth.AuthProvider {
    switch(providerId) {
      case 'facebook.com': return new firebase.auth.FacebookAuthProvider();
      case 'twitter.com': return new firebase.auth.TwitterAuthProvider();
      case 'google.com': return new firebase.auth.GoogleAuthProvider();
      case 'password': return new firebase.auth.EmailAuthProvider();
    }
  }

  /**
   * @private showErrorAlert()
   * - used in async 'catch' blocks to evaluate auth error and show appropriate message
   * @param error Error
   * @returns Promise<void>
   */
  private async showErrorAlert(error: any): Promise<void> {
    try {
      let msg: string;
      switch(error.code) {
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
        default: msg = error.message
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
  
  /**
   * @private successToast()
   * - Presents a success toast for updating password or email
   * @param type string
   */
  private async successToast(msg: string): Promise<void> {
    try {
      const successToast = await this.toastCtrl.create({
        message: msg,
        position: 'middle',
        duration: 2500
      });
      await successToast.present();
    }
    catch(e) { console.log('passwordSuccessToast error: ', e) }
  }
}
