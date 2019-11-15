import { Component, OnInit } from '@angular/core';
import { OrdenService } from '../../../services/service.index';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-guias',
  templateUrl: './guias.component.html',
  styleUrls: ['./guias.component.scss']
})
export class GuiasComponent implements OnInit {

  guias = [];
  guia;
  indice = 0;
  loading = true;
  currentDate = new Date();
  inicio: any;
  fin: any;
  oculto = 'oculto';

  datePipe = new DatePipe('en-US');

  constructor(
    private ordenService: OrdenService,
  ) { }

  ngOnInit() {
    this.inicio = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.fin = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.getGuias();
  }

  getGuias() {
    this.ordenService.getGuias(this.inicio, this.fin).subscribe(facturas => {
      this.guias = facturas.map(e => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      this.loading = false;
    });
  }

  mostrar(guia: any, i) {
    this.oculto = '';
    this.guia = guia;
    this.indice = i;
  }

  consultar() {
    if (new Date(this.fin) < new Date(this.inicio)) {
      this.swal(
        'Error',
        `La Fecha Fin no puede ser menor a la Fecha Inicio`,
        'warning'
      );
      return;
    }
    this.getGuias();
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
