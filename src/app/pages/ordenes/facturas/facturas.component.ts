import { Component, OnInit } from '@angular/core';
import { OrdenService } from '../../../services/service.index';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {

  facturas = [];
  factura;
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
    this.getFacturas();
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
    this.getFacturas();
  }

  getFacturas() {
    this.ordenService.getFacturasFechas(this.inicio, this.fin).subscribe(facturas => {
      this.facturas = facturas.map(e => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      this.loading = false;
    });
  }

  mostrar(factura: any) {
    this.oculto = '';
    this.factura = factura;
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
