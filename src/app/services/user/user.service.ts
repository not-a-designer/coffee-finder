import { Injectable }       from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable }       from 'rxjs';

import * as firebase        from 'firebase/app';

import { CoffeeUser }       from '@app-interfaces/coffee-user';


@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private afs: AngularFirestore) { }

  /**
   * @public updateUser()
   * - updates CoffeeUser in firestore from authentication
   * @param user firebase.User
   */
  public updateUser(user: firebase.User) {
    const coffeeUser = this.buildUser(user);
    this.afs.doc<CoffeeUser>(`users/${user.uid}`).set(coffeeUser, { merge: true });
  }

  /**
   * updateUserSettings()
   * - updates App user optional data
   * @param user CoffeeUser
   */
  public updateUserSettings(user: CoffeeUser) { this.afs.doc<CoffeeUser>(`users/${user.uid}`).update(user) }

  /**
   * @public getUser()
   * - returns Observable<CoffeeUser> from firestore
   * @param uid 
   * @returns Observable<CoffeeUser>
   */
  public getUser(uid: string): Observable<CoffeeUser> { return this.afs.doc<CoffeeUser>(`users/${uid}`).valueChanges() }

  
  /**
   * @private buildUser()
   * - creates CoffeeUser from firebase.User
   * @param user firebase.User
   * @returns CoffeeUser
   */
  private buildUser(user: firebase.User): CoffeeUser {
    let curProviderData: firebase.UserInfo[] = [];

    for (const provider of user.providerData) {
      const newProvider: firebase.UserInfo = {
        displayName: provider.displayName,
        email: provider.email,
        phoneNumber: provider.phoneNumber,
        photoURL: provider.photoURL,
        providerId: provider.providerId,
        uid: provider.uid
      };
      curProviderData.push(newProvider);
    }
    const Cuser: CoffeeUser = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      isAdmin: false,
      providerData: curProviderData,
      displayName: user.displayName || ''
    };
    return Cuser;
  }  
}
