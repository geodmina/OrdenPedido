import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { Username } from '../../models/username';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  uid: string;
  username: Username;

  constructor(
    private firebaseAuth: AngularFireAuth,
    public  router:  Router,
    private serviceUser: UserService
    ) {
    /* this.firebaseAuth.authState.subscribe(
      user => {
        if (user) {
          this.serviceUser.getUser(user.uid).pipe(
            map(
              objUsername => {
                const data = objUsername.payload.data();
                const id = objUsername.payload.id;
                return data;
              }
            )
          ).subscribe(
            objUsername => {
              this.username = objUsername;
              this.saveStorage(user, this.username);
            }
          );
        } else {
          this.saveStorage(null, null);
        }
      }
    ); */
  }

  login(email: string, password: string) {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
  }

  /* async login(email: string, password: string) {
    try {
      await this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['dashboard']);
    } catch ( e ) {
      if ( e.code === 'auth/user-not-found') {
        Swal.fire({
          title: 'Error!',
          text: 'Usuario/Contraseña incorrectos',
          type: 'error'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Error ' + e.code,
          type: 'error'
        });
      }
    }
  } */

  async logout(){
    await this.firebaseAuth.auth.signOut();
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    this.router.navigate(['login']);
  }

  get isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
  }

  loadStorage() {
    if ( localStorage.getItem('uid')) {
      this.user = JSON.parse( localStorage.getItem('user') );
      this.username = JSON.parse( localStorage.getItem('username') );
    } else {
      this.user = null;
    }
  }

  saveStorage( user: User, username: Username) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('username', JSON.stringify(username));
    this.user = user;
  }

  createUser(email: string, password: string) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password);
  }

}
