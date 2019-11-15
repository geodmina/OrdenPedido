import { Component, OnInit } from '@angular/core';
import { OrdenService, ClientService, ProductService } from '../../services/service.index';
import { Transportista } from '../../models/transportista';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: []
})
export class OrdenComponent implements OnInit {

  factura;
  ordenes = [];
  orden;
  loading = true;
  currentDate = new Date();
  inicio: any;
  fin: any;

  datePipe = new DatePipe('en-US');

  titleModal = '';
  oculto = 'oculto';
  ocultoDetalle = 'oculto';
  objTransportista: Transportista = new Transportista();
  titleCancel = '';

  constructor(
    private ordenService: OrdenService,
    private clienteService: ClientService,
    private productoService: ProductService
  ) { }

  ngOnInit() {
    this.inicio = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.fin = this.datePipe.transform(this.currentDate.setDate(this.currentDate.getDate() + 1), 'yyyy-MM-dd');
    this.currentDate.setDate(this.currentDate.getDate() - 2);
    this.getOrdenes();
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
    this.getOrdenes();
  }

  getOrdenes() {
    this.ordenService.getOrdenesTodas(this.inicio, this.fin).subscribe(ordenes => {
      this.ordenes = ordenes.map(e => {
        return {
          uid: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      this.loading = false;
    });
  }

  anularOrden(orden: any) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Desea anular la orden # ${orden.numero}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        orden.estado = 'ANULADA';
        this.ordenService.updateOrden(orden).then(data => {
          this.restaurar(orden);
          this.swal(
            'Orden Anulada',
            `La orden # ${orden.numero} fue anulada con exito `,
            'success'
          );
        });
      }
    });
  }

  anularFactura(orden: any) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Desea anular la factura # ${orden.factura}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        orden.estado = 'ANULADA';
        orden.facturada = false;
        this.ordenService.updateOrden(orden).then(data => {
          this.restaurar(orden);
          this.swal(
            'Orden Anulada',
            `La factura # ${orden.factura} fue anulada con exito `,
            'success'
          );
        });
      }
    });
  }

  facturarOrden(orden: any) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Desea facturar la orden # ${orden.numero}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        orden.estado = 'FACTURADA';
        orden.factura = `001-100-${this.PadLeft(orden.numero, 9)}`;
        orden.facturada = true;
        orden.fechaFactura = new Date();
        this.ordenService.updateOrden(orden).then(data => {
          this.swal(
            'Orden Facturada',
            `La orden # ${orden.numero} fue facturada con exito, generando la factura # ${orden.factura}`,
            'success'
          );
        });
      }
    });
  }

  generarGuia(orden: any) {
    this.orden = orden;
    this.oculto = '';
    this.ocultoDetalle = '';
    this.objTransportista = new Transportista();
    this.titleModal = 'Guìa de Remisión';
    this.titleCancel = `¿Desea descartar la generación de la Guía de Remisión para la factura # ? ${orden.factura}`;
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
        this.objTransportista = new Transportista();
        this.oculto = 'oculto';
        this.titleModal = '';
      }
    });
  }

  anularGuia(orden: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Desea anular la guia # ${orden.guias[orden.guias.length - 1].numero}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        orden.estado = 'FACTURADA';
        orden.guias[orden.guias.length - 1].estado = 'ANULADA';
        this.ordenService.updateOrden(orden).then(data => {
          this.swal(
            'Orden Anulada',
            `La guia # ${orden.guias[orden.guias.length - 1].numero} fue anulada con exito `,
            'success'
          );
        });
      }
    });
  }

  marcarEntregado(orden: any) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Desea marcar el pedido # ${orden.numero} como entregado`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        orden.estado = 'ENTREGADA';
        orden.guias[orden.guias.length - 1].estado = 'ENTREGADA';
        orden.entregada = true;
        this.ordenService.updateOrden(orden).then(data => {
          this.restaurar(orden);
          this.swal(
            'Orden Entregada',
            `La orden # ${orden.numero} fue entregada con exito`,
            'success'
          );
        });
      }
    });

  }

  actionForm(form: NgForm) {

    let numeroGuia = 0;
    let guias = [];

    if (this.orden.guias) {
      numeroGuia = this.orden.guias.length + 1;
      guias = this.orden.guias;
    } else {
      numeroGuia = 1;
    }

    // const guias = this.orden.guias;
    // const numeroGuia = this.orden.guias ? this.orden.guias.length + 1 : 1;
    const guia = {
      numero: `001-${this.PadLeft(this.orden.numero, 7)}-${numeroGuia}`,
      transportista: form.value,
      fecha: new Date(),
      estado: 'ACTIVA'
    };
    this.orden.despachadas = true;
    this.objTransportista = form.value;
    this.orden.estado = 'DESPACHADA';
    /*this.orden.guia = `001-${this.PadLeft(this.orden.numero, 7)}`;
    this.orden.fechaGuia = new Date();
    this.orden.despachadas = true;
    this.orden.transportista = this.objTransportista.name;
    this.orden.nuc = this.objTransportista.nuc;
    this.orden.placa = this.objTransportista.plaque;*/
    guias.push(guia);
    this.orden.guias = guias;
    this.ordenService.updateOrden(this.orden).then(data => {
      this.objTransportista = new Transportista();
      this.oculto = 'oculto';
      this.titleModal = '';
      form.reset();
      this.swal(
        'Guía de remisión generada',
        `Se generó la Guía de remisión # ${this.orden.guias[numeroGuia - 1].numero} para la factura # ${this.orden.factura}`,
        'success'
      );
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

  PadLeft(value, length) {
    return (value.toString().length < length) ? this.PadLeft('0' + value, length) : value;
  }

  mostrar(factura: any) {
    this.ocultoDetalle = '';
    this.factura = factura;
  }

  restaurar(orden: any) {

    const editSubscribe = this.clienteService.getCliente(orden.cliente.toString()).subscribe(
      (cliente) => {
        const cu = cliente.payload.data()['cu'];
        const ca = cu - orden.total;

        this.clienteService.restauraCupo(orden.cliente.toString(), ca).then(() => {
          console.log('Documento editado exitósamente');
        }, (error) => {
          console.log(error);
        });
        editSubscribe.unsubscribe();
      });


    orden.detalles.forEach(element => {

      const editSubscribeP = this.productoService.getProduct(element.producto.toString()).subscribe(
        (cliente) => {
          const stock = cliente.payload.data()['stock'];
          const stockA = stock + element.cantidad;

          this.productoService.restauraStock(element.producto.toString(), stockA).then(() => {
            console.log('Documento editado exitósamente');
          }, (error) => {
            console.log(error);
          });
          editSubscribeP.unsubscribe();
        });


    });


    /*this.clienteService.updateDoc(uid).subscribe((res: any) => {
      if (res.length > 0) {
        let id = res[0].payload.doc.id;
        this.clienteService.restauraCupo(id);
      }
    });*/
  }

}
