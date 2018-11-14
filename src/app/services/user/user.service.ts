import { Injectable }       from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable }       from 'rxjs';

import * as firebase        from 'firebase/app';

import { User }             from '@app-interfaces/coffee-user';


@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private afs: AngularFirestore) { }

  /**
   * @public updateUser()
   * - updates App user in firestore from authentication
   * @param user firebase.User
   */
  public updateUser(user: firebase.User) {
    const coffeeUser: User = this.buildUser(user);
    this.afs.doc<User>(`users/${user.uid}`).set(coffeeUser, { merge: true });
  }

  /**
   * updateUserSettings()
   * - updates App user optional data
   * @param user User
   */
  public updateUserSettings(user: User) { this.afs.doc<User>(`users/${user.uid}`).update(user) }

  /**
   * @public getUser()
   * - returns Observable<User> from firestore
   * @param uid 
   * @returns Observable<User>
   */
  public getUser(uid: string): Observable<User> { return this.afs.doc<User>(`users/${uid}`).valueChanges() }

  /**
   * @private buildUser()
   * - creates custom User from firebase.User
   * @param user firebase.User
   * @returns User
   */
  private buildUser(user: firebase.User): User {
    return {
      displayName: user.displayName || null,
      email: user.email ? user.email : user.providerData[0].email,
      emailVerified: user.emailVerified,
      providerId: user.providerData[0].providerId,
      isAdmin: false,
      uid: user.uid,
    };
  }  
}
