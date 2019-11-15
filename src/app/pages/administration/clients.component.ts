import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/client';
import { Username } from '../../models/username';
import { ClientService, UserService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { City } from '../../models/city';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html'
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  clientsF: Client[] = [];
  usernames: Username[] = [];

  edit = false;

  loading = true;

  oculto = 'oculto';
  objClient: Client = new Client();
  action = '';
  titleModal = '';
  titleCancel = '';

  cities = [];

  imageLoad: File;
  imageTemp: string;

  /*imageLoad: File;
  imageTemp = '/assets/img/customer_avatar.png';*/

  constructor(
    private clientService: ClientService,
    private userService: UserService,
    private _storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.getClients();
    this.getUsers();
    this.getCities();
  }

  onSearchChange(searchValue: string): void {
    if ( searchValue.length > 3 ) {
      this.clients = this.clientsF.filter(function(item) {
        return item.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
        item.lastname.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
        item.ruc.toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ;
      });
    } else {
      this.clients = this.clientsF;
    }
  }

  getCities() {
    this.clientService.getCities().subscribe(clients => {
      this.cities = clients.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as City;
      });
    });
  }

  getClients() {
    this.clientService.getClients().subscribe(clients => {
      this.clientsF = clients.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Client;
      });
      this.clients = this.clientsF;
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
    this.objClient.cu = 0;
    this.objClient.cm = 0;
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
    if (!this.imageLoad) {
      this.swal('Error', 'Debe elegir una imagen para el cliente', 'error');
      return;
    }
    if (form.invalid) { return; }
    // Generate a random ID
    const randomId = Math.random().toString(36).substring(2);
    console.log(randomId);
    const filepath = `images/${randomId}`;
    const fileRef = this._storage.ref(filepath);
    // Upload image
    const task = this._storage.upload(filepath, this.imageLoad);
    return task.snapshotChanges()
      .pipe(
        finalize(
          () => {
            fileRef.getDownloadURL().subscribe(url => {
              form.value.image = url;
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
            });
          }
        )
      ).subscribe();

  }

  editForm() {
    this.edit = true;
  }

  editClient(client: Client) {
    this.oculto = '';
    this.objClient = client;
    this.action = 'edit';
    this.titleModal = 'Modificación de cliente';
    this.titleCancel = '¿Desea descartar la modificación del cliente?';
  }

  updateClient(form: NgForm) {
    if (form.invalid) { return; }
    if (this.imageLoad) {
      // Generate a random ID
      const randomId = Math.random().toString(36).substring(2);
      console.log(randomId);
      const filepath = `images/${randomId}`;
      const fileRef = this._storage.ref(filepath);
      // Upload image
      const task = this._storage.upload(filepath, this.imageLoad);
      return task.snapshotChanges()
        .pipe(
          finalize(
            () => {
              fileRef.getDownloadURL().subscribe(url => {
                this.edit = false;
                form.value.image = url;
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
              });
            }
          )
        ).subscribe();
    } else {
      this.edit = false;
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
        this.edit = false;
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
