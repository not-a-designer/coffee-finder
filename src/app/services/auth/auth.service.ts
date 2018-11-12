
import { Injectable }      from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { GooglePlus }      from '@ionic-native/google-plus/ngx';

import { Observable, of }  from 'rxjs';
import { switchMap }       from 'rxjs/operators';

import * as firebase       from 'firebase/app';

import { environment }     from '@environments/environment';
import { UserService }     from '@app-services/user/user.service';
import { User }            from '@app-interfaces/coffee-user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public firebaseUser$: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, 
              private gPlus: GooglePlus,
              private users: UserService) { 
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

  /** AngularFire signInWithEmailAndPassword() **/
  public async emailLogin(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try { return await this.afAuth.auth.signInWithEmailAndPassword(email, password) }
    catch(e) { console.log('emailLogin() error: ', e) }
  }

  /** AngularFire createUserWithEmailAndPassword() **/
  public async emailRegister(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try { return await this.afAuth.auth.createUserWithEmailAndPassword(email, password) }
    catch(e) { console.log('emailRegister() error: ', e) }
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
    catch(e) { console.log('native googleLogin() error: ', e) }
  }


  /** Ionic native googleLogout() **/
  public googleLogout() { this.gPlus.logout() }

  /** AngularFire signInWithPopup() **/
  public async browserSocialLogin(network: string): Promise<firebase.auth.UserCredential> {
    try {
      const provider = this.determineProvider(network);
      return await this.afAuth.auth.signInWithPopup(provider);
    }
    catch(e) { console.log('browserSocialLogin() error: ', e) }
  }

  /** helper functions **/
  private determineProvider(provider: string): firebase.auth.AuthProvider {
    switch(provider) {
      case 'facebook': return new firebase.auth.TwitterAuthProvider();
      case 'twitter': return new firebase.auth.FacebookAuthProvider();
      //Default to google provider
      default: return new firebase.auth.GoogleAuthProvider();
    }
  }
}
