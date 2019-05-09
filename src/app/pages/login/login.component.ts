import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { UserService } from '../../services/service/user.service';
import { map } from 'rxjs/operators';

@Component({
  // selector: 'app-login',
  selector: 'app-dashboard',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string;

  constructor(
    public router: Router,
    public authService: AuthService,
    private userService: UserService
  ) {
    // this.email = localStorage.getItem('admin_email') ||  '';
  }

  ngOnInit() {
    if (this.authService.isLoggedIn ) {
      this.router.navigate(['dashboard']);
    }
  }

  sign_in( form: NgForm) {
    if ( form.invalid ) {
      return;
    }
    this.authService.login(form.value.email, form.value.password)
      .then(
        (user: any) => {
          this.userService.getUser(user.user.uid).pipe(
            map(
              objUsername => {
                const data = objUsername.payload.data();
                const id = objUsername.payload.id;
                return data;
              }
            )
          ).subscribe(
            objUsername => {
              this.authService.username = objUsername;
              this.authService.saveStorage(user, objUsername);
              this.router.navigate(['dashboard']);
            }
          );
        }
      ).catch(
        error => {
          if ( error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            Swal.fire({
              title: 'Error!',
              text: 'Usuario/Contraseña incorrectos',
              type: 'error'
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Error ' + error.code,
              type: 'error'
            });
          }
        }
      );
  }

  // try {
/*     await this.firebaseAuth.auth.signInWithEmailAndPassword(email, password);
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
  } */

  logout() {
    this.authService.logout();
  }

  swal(title: string, text: string, type: any) {
    Swal.fire(
      {
        title: title,
        text: text,
        type: type
      }
    );
  }

}
