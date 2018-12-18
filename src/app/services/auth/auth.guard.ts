import { Injectable }          from '@angular/core';
import { Router,
         CanActivate, 
         ActivatedRouteSnapshot, 
         RouterStateSnapshot } from '@angular/router';

import { Observable }          from 'rxjs';
import { map, take, tap }      from 'rxjs/operators';

import * as firebase           from 'firebase/app';

import { AuthService }         from '@app-services/auth/auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //const userAuthState = this.auth.isLoggedIn();
    return this.auth.isLoggedIn().pipe(
      take(1),
      map((user: firebase.User) => { 
        if (user) console.log(user.uid);
        return !!user;
      }),
      tap((loggedIn: boolean) => {
        if (!loggedIn) {
          this.router.navigateByUrl('/login');
          console.error('not logged in');
          return false;
        }

        console.log('logged in');
        return true;
      })
    );
  }
}
