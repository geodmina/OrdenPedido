import { Component, OnInit } from '@angular/core';
import { UserService, OrdenService } from '../../services/service.index';
import { Username } from '../../models/username';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styles: []
})
export class MetasComponent implements OnInit {

  fechaActual = new Date();
  datePipe = new DatePipe('en-US');
  anioEdita: any;
  mesEdita: any;

  usernames: Username[] = [];
  vendedor = 0;
  anio = 0;
  anios = [2019, 2020, 2021];
  enero = 0;
  febrero = 0;
  marzo = 0;
  abril = 0;
  mayo = 0;
  junio = 0;
  julio = 0;
  agosto = 0;
  septiembre = 0;
  octubre = 0;
  noviembre = 0;
  diciembre = 0;
  meta: any;
  metaId = '';

  constructor(
    private userService: UserService,
    private ordenService: OrdenService,
  ) { }

  ngOnInit() {
    this.anioEdita = this.datePipe.transform(this.fechaActual, 'yyyy');
    this.mesEdita = this.datePipe.transform(this.fechaActual, 'MM');
    this.getUsers();
  }

  getUsers() {
    this.userService.getSellers().subscribe(users => {
      this.usernames = users.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Username;
      });
    });
  }

  consultar() {

    if (this.vendedor === 0 || this.anio === 0) {
      this.swal(
        'Error',
        'Debe seleccionar un vendedor y un año',
        'error'
      );
      return;
    }

    this.enero = 0;
    this.febrero = 0;
    this.marzo = 0;
    this.abril = 0;
    this.mayo = 0;
    this.junio = 0;
    this.julio = 0;
    this.agosto = 0;
    this.septiembre = 0;
    this.octubre = 0;
    this.noviembre = 0;
    this.diciembre = 0;
    this.metaId = '';

    this.ordenService.getMetas(this.vendedor, this.anio).subscribe(metas => {
      metas.forEach(a => {
        this.metaId = a.payload.doc.id,
        this.meta = a.payload.doc.data();
        this.enero = this.meta.metas.enero;
        this.febrero = this.meta.metas.febrero;
        this.marzo = this.meta.metas.marzo;
        this.abril = this.meta.metas.abril;
        this.mayo = this.meta.metas.mayo;
        this.junio = this.meta.metas.junio;
        this.julio = this.meta.metas.julio;
        this.enero = this.meta.metas.enero;
        this.septiembre = this.meta.metas.septiembre;
        this.octubre = this.meta.metas.octubre;
        this.noviembre = this.meta.metas.noviembre;
        this.diciembre = this.meta.metas.diciembre;
      });
    });

    this.swal(
      'Consulta OK',
      'Consulta exitosa',
      'success'
    );
  }

  guardar() {

    if (this.metaId === '') {

      const meta = {
        vendedor: this.vendedor,
        anio: this.anio,
        metas: {
          enero: this.enero,
          febrero: this.febrero,
          marzo: this.marzo,
          abril: this.abril,
          mayo: this.mayo,
          junio: this.junio,
          julio: this.julio,
          agosto: this.agosto,
          septiembre: this.septiembre,
          octubre: this.octubre,
          noviembre: this.noviembre,
          diciembre: this.diciembre
        }
      };

      this.ordenService.addMeta(meta)
        .then(data => {
          this.swal(
            'Registro guardado',
            'Metas registradas de manera exitosa',
            'success'
          );
        });

    } else {

      const meta = {
        id: this.metaId,
        vendedor: this.vendedor,
        anio: this.anio,
        metas: {
          enero: this.enero,
          febrero: this.febrero,
          marzo: this.marzo,
          abril: this.abril,
          mayo: this.mayo,
          junio: this.junio,
          julio: this.julio,
          agosto: this.agosto,
          septiembre: this.septiembre,
          octubre: this.octubre,
          noviembre: this.noviembre,
          diciembre: this.diciembre
        }
      };

      this.ordenService.updateMeta(meta)
        .then(data => {
          this.swal(
            'Registro guardado',
            'Metas actualizada de manera exitosa',
            'success'
          );
        });

    }

    this.enero = 0;
    this.febrero = 0;
    this.marzo = 0;
    this.abril = 0;
    this.mayo = 0;
    this.junio = 0;
    this.julio = 0;
    this.agosto = 0;
    this.septiembre = 0;
    this.octubre = 0;
    this.noviembre = 0;
    this.diciembre = 0;

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
