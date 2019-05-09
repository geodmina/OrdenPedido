import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/client';
import { Username } from '../../models/username';
import { ClientService, UserService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  usernames: Username[] = [];

  loading = true;

  oculto = 'oculto';
  objClient: Client = new Client();
  action = '';
  titleModal = '';
  titleCancel = '';

  imageLoad: File;
  imageTemp = '/assets/img/customer_avatar.png';

  constructor(
    private clientService: ClientService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getClients();
    this.getUsers();
  }

  getClients() {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Client;
      });
      this.loading = false;
    });
  }

  getUsers() {
    this.userService.getUsers().subscribe(users => {
      this.usernames = users.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Username;
      });
    });
  }

  selectImage(file: File) {
    if (!file) {
      this.imageLoad = null;
      return;
    }

    if (file.type.indexOf('image') < 0) {
      this.swal(
        'Sólo imágenes',
        'El archivo seleccionado no es una imagen',
        'error'
      );
      this.imageLoad = null;
      return;
    }

    this.imageLoad = file;

    const reader = new FileReader();
    const urlImageTemp = reader.readAsDataURL(file);

    reader.onloadend = () => (this.imageTemp = reader.result.toString());
  }

  newClient() {
    this.oculto = '';
    this.objClient = new Client();
    this.objClient.should = false;
    this.action = 'new';
    this.titleModal = 'Registro de cliente';
    this.titleCancel = '¿Desea descartar el ingreso del nuevo cliente?';
  }

  actionForm(form: NgForm) {
    if (this.action === 'new') {
      this.createClient(form);
    }
    if (this.action === 'edit') {
      this.updateClient(form);
    }
  }

  createClient(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.clientService
      .addClient(form.value)
      .then(data => {
        this.oculto = 'oculto';
        this.action = '';
        this.swal(
          'Registro guardado',
          'Cliente registrado de manera exitosa',
          'success'
        );
        form.resetForm();
        this.objClient = new Client();
      })
      .catch(error => {
        this.swal('Error', 'Error al registrar cliente', 'error');
      });
  }

  editClient(client: Client) {
    this.oculto = '';
    this.objClient = client;
    this.action = 'edit';
    this.titleModal = 'Modificación de cliente';
    this.titleCancel = '¿Desea descartar la modificación del cliente?';
  }

  updateClient(form: NgForm) {
    if (form.invalid) {
      return;
    }
    form.value.image = '/assets/img/customer_avatar.png';
    this.clientService.updateClient(form.value).then(data => {
      this.oculto = 'oculto';
      this.action = '';
      this.swal(
        'Registro modificado',
        'Cliente modificado de manera exitosa',
        'success'
      );
      form.resetForm();
      this.objClient = new Client();
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
        this.objClient = new Client();
        this.objClient.should = false;
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
