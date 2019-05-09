import { Component, OnInit } from '@angular/core';
import { Username } from '../../models/username';
import { UserService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/service/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {

  usernames: Username[] = [];
  loading = true;

  oculto = 'oculto';

  objUsername: Username = new Username();
  action = '';
  titleModal = '';
  titleCancel = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(users => {
      this.usernames = users.map(e => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Username;
      });
      this.loading = false;
    });
  }

  newUsername() {
    this.oculto = '';
    this.objUsername = new Username();
    this.action = 'new';
    this.titleModal = 'Registro de usuarios';
    this.titleCancel = '¿Desea descartar el ingreso del nuevo usuario?';
  }

  editUsername(username: Username) {
    this.oculto = '';
    this.objUsername = username;
    this.action = 'edit';
    this.titleModal = 'Modificación de usuario';
    this.titleCancel = '¿Desea descartar la modificación del usuario?';
  }

  actionForm(form: NgForm) {
    if (this.action === 'new') {
      this.createUsername(form);
    }
    if (this.action === 'edit') {
      this.updateUsername(form);
    }
  }

  createUsername(form: NgForm) {
    this.authService.createUser(form.value.email, form.value.password)
        .then(
          (user: any) => {
            this.objUsername = form.value;
            this.objUsername.uid = user.user.uid;
            this.authService.username = this.objUsername;
              this.authService.saveStorage(user, this.objUsername);
            this.userService.addUser(this.objUsername)
              .then(data => {
                this.oculto = 'oculto';
                this.action = '';
                this.swal(
                  'Registro guardado',
                  'Usuario registrado de manera exitosa',
                  'success'
                );
                form.resetForm();
                this.objUsername = new Username();
              })
              .catch(error => {
                this.swal('Error', 'Error al registrar usuario', 'error');
              });
          }
        ).catch(
          error => {
            this.swal(
              'Error',
              `Error al crear usuario ${error}`,
              'success'
            );
          }
        );
  }

  updateUsername(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.userService.updateUser(form.value).then(data => {
      this.oculto = 'oculto';
      this.action = '';
      this.swal(
        'Registro modificado',
        'Usuario modificado de manera exitosa',
        'success'
      );
      form.resetForm();
      this.objUsername = new Username();
    });
  }

  closeModal() {
    Swal.fire({
      title: '¿Está seguro?',
      text: this.titleCancel,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        this.objUsername = new Username();
        this.oculto = 'oculto';
        this.action = '';
      }
    });
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
