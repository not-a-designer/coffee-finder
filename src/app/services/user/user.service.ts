import { Injectable }       from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable }       from 'rxjs';

import * as firebase        from 'firebase/app';

import { User }             from '@app-interfaces/coffee-user';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private afs: AngularFirestore) { }

  public updateUser(user: firebase.User) {
    const coffeeUser: User = this.buildUser(user);
    this.afs.doc<User>(`users/${user.uid}`).set(coffeeUser, { merge: true });
  }

  public updateUserSettings(user: User) { this.afs.doc<User>(`users/${user.uid}`).update(user) }

  public getUser(uid: string): Observable<User> { return this.afs.doc<User>(`users/${uid}`).valueChanges() }

  private buildUser(user: firebase.User): User {
    return {
      email: user.email,
      isAdmin: false,
      uid: user.uid
    };
  }  
}
