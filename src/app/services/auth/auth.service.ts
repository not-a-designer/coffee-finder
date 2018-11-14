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
import { User }                                   from '@app-interfaces/coffee-user';


export const EMAIL_REGEXP: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASS_REGEXP: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;

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
  get user$(): Observable<User> { 
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
      await this.showErrorAlert(e);
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
        const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken)
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
  public async browserSocialLogin(network: string): Promise<firebase.auth.UserCredential> {
    try {
      const provider = this.determineProvider(network);
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

  /**
   * @public showResetPasswordAlert()
   * - shows Alert with email prompt
   * - if the email is valid AngularFireAuth will send a reset email
   * @returns Promise<void>
   */
  public async showResetPasswordAlert(): Promise<void> {
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
            const loader = await this.loadingCtrl.create({ message: 'resetting...' })
            try { 
              if (EMAIL_REGEXP.test(data.email)) {
                loader.dismiss();
                await this.resetPassword(data.email);
                await this.passwordResetSuccessAlert(data.email);
              }
            }
            catch(e) { 
              loader.dismiss()
              console.log(e.code);
              await this.showErrorAlert(e);
              console.log('showResetPasswordAlert() error: ', e);
            }
          }
        }]
      });

      await resetAlert.present();
    }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('showResetPasswordAlert() error: ', e) }
  }

  /**
   * @public verifyIdentityAlert()
   * - Takes type parameter to call password or email update after confirming you identity
   * @param type string
   */
  public async verifyIdentityAlert(type: string): Promise<void> {
    try {
      const oldPassword = await this.alertCtrl.create({
        header: 'Confirm Identity',
        message: 'Enter you current password',
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
                if (type === 'updatePassword') this.showNewPasswordAlert(data.password);
                if (type === 'updateEmail') this.showUpdateEmailAlert(data.password);
              }
              else await this.passwordChangeErrorAlert('Your current password is required');
            }
            catch(e) { 
              console.log(e.code);
              await this.showErrorAlert(e);
              console.log('update email handler error: ', e);
            }
          })
        }]
      });
      await oldPassword.present();
    }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('verifyIdentityAlert() error: ', e);
    }
  }

  

  /**
   * @public sendEmailVerification()
   * @param user firebase.User
   * @returns Promise<void>
   */
  public async sendEmailVerification(): Promise<void> {
    try {
      if (this.afAuth.auth.currentUser != null || this.afAuth.auth.currentUser != undefined) {
        const u = this.afAuth.auth.currentUser;
        if (!u.emailVerified) {
          await u.sendEmailVerification();
          await this.verificationEmailToast(u.email);
        }
      }
    }
    catch(e) {
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('sendEmailVerification() error: ', e);
    }
  }

  
  /*********************************************************************/
  /**                         PRIVATE METHODS                         **/
  /*********************************************************************/
  /**
   * @private determineProvider()
   * - used by browserSocialLogin() to get appropriate AuthProvider
   * @param provider string
   * @returns firebase.auth.AuthProvider
   */
  private determineProvider(provider: string): firebase.auth.AuthProvider {
    switch(provider) {
      case 'facebook': return new firebase.auth.FacebookAuthProvider();
      case 'twitter': return new firebase.auth.TwitterAuthProvider();
      //Default to google provider
      default: return new firebase.auth.GoogleAuthProvider();
    }
  }

  /**
   * @private resetPassword()
   * - used by showResetPasswordAlert() to send email when the Alert is confirmed
   * @param email 
   * @returns Promise<void>
   */
  private async resetPassword(email: string): Promise<void> {
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
      await this.showErrorAlert(e);
      console.error('resetPassword() error: ', e) 
    }
  }


  /**
   * passwordResetSuccessAlert()
   * - presents an Alert to notify user that a password reset link has been sent
   * @param email string
   */
  private async passwordResetSuccessAlert(email: string): Promise<void> {
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
   * @private verificationEmailToast()
   * - sends an verification link to user's email
   * - presents toast on success
   * @param email string
   */
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

  /**
   * @private successToast()
   * - Presents a success toast for updating password or email
   * @param type string
   */
  private async successToast(type: string): Promise<void> {
    try {
      const newType: string = type;
      newType[0].toUpperCase;
      const successToast = await this.toastCtrl.create({
        message: `${newType} was successfully changed`,
        position: 'middle',
        duration: 2500
      });
      await successToast.present();
    }
    catch(e) { console.log('passwordSuccessToast error: ', e) }
  }

  /**
   * passwordChangeErrorAlert()
   * @param msg string
   */
  private async passwordChangeErrorAlert(msg: string): Promise<void> {
    try {
      const errorAlert = await this.alertCtrl.create({
        header: 'Password Change Error',
        message: msg,
        buttons: ['OK']
      });
      await errorAlert.present();
    }
    catch(e) { console.log('passwordErrorToast error: ', e) }
  }

  /**
   * showNewPasswordAlert()
   * - presents an ALert to accept a new password and confirmation
   * - updates user password if new passwords are valid
   * @param odlPassword: string
   */
  private async showNewPasswordAlert(oldPassword: string): Promise<void> {
    try {
      const confirmPasswordAlert = await this.alertCtrl.create({
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
                    const credential = await this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(
                      firebase.auth.EmailAuthProvider.credential(this.afAuth.auth.currentUser.email, oldPassword));
                    if (credential.user) {
                      await this.afAuth.auth.currentUser.updatePassword(data.password);
                      this.successToast('password');
                    }
                  }
                  else this.passwordChangeErrorAlert('confirmation does not match the new password');
                }
                else this.passwordChangeErrorAlert('Please enter a valid new password (min 6 char, at least 1 capital and 1 number)');
              }
              else this.passwordChangeErrorAlert('Please enter a valid password/confirmation password');
            }
            catch(e) { 
              this.showErrorAlert(e);
              console.log('Confirm handler error: ', e);
            }
          })
        }]
      });
      await confirmPasswordAlert.present();
    }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('showChangePasswordAlert() error: ', e);
    }
  }

  /**
   * showUpdateEmailAlert()
   * - presents Alert to update user email
   * - presents success toast if new email is valid
   * @param oldPassword string
   */
  private async showUpdateEmailAlert(oldPassword: string): Promise<void> {
    try {
      const updateAlert = await this.alertCtrl.create({
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
              if (data.email && EMAIL_REGEXP.test(data.email)) {
                const credential = await this.afAuth.auth.currentUser.reauthenticateAndRetrieveDataWithCredential(
                  firebase.auth.EmailAuthProvider.credential(this.afAuth.auth.currentUser.email, oldPassword));
                if (credential.user) {
                  await this.afAuth.auth.currentUser.updateEmail(data.email);
                  this.users.updateUser(this.afAuth.auth.currentUser);
                  this.successToast('email');
                }
              }
              else this.showErrorAlert('Please enter a valid email address');
            }
            catch(e) { 
              console.log(e.code);
              await this.showErrorAlert(e);
              console.log('update handler error: ', e);
            }
          })
        }]
      });
      await updateAlert.present();
    }
    catch(e) { 
      console.log(e.code);
      await this.showErrorAlert(e);
      console.log('update email error: ', e);
    }
  }
}
