import { Component, OnInit } from '@angular/core';
import { UserService, OrdenService } from '../../../services/service.index';
import { Username } from '../../../models/username';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {

  loading = true;
  currentDate = new Date();
  inicio: any;
  fin: any;

  datePipe = new DatePipe('en-US');

  orden: any;
  detalles: any[] = [];

  productos = [];
  reporte = [];
  item = {
    producto: '',
    cantidad: 0,
    valor: 0
  };

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType = 'pie';
  public ChartLegend = true;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    { data: [], label: 'Total Pedido' },
    { data: [], label: 'Total Facturado' }
  ];

  constructor(
    private userService: UserService,
    private ordenService: OrdenService
  ) { }

  ngOnInit() {
    this.inicio = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.fin = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.getOrders();
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
    this.getOrders();
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

  getOrders() {
    this.ordenService.getOrdenesFechas(this.inicio, this.fin).subscribe(orders => {

      const numOrdenes = orders.length;
      let indice = 0;
      this.reporte.splice(0, this.reporte.length);
      this.productos.splice(0, this.productos.length);
      this.pieChartLabels.splice(0, this.pieChartLabels.length);
      this.pieChartData.splice(0, this.pieChartData.length);
      orders.forEach(a => {
        this.orden = a.payload.doc.data();
        this.detalles = this.orden.detalles;
        this.detalles.forEach(b => {
          const index = this.productos.findIndex(x => x.producto === b.productoNombre);
          if (index === -1) {
            this.item = {
              producto: b.productoNombre,
              cantidad: b.cantidad,
              valor: b.valuni
            };
            this.productos.push(this.item);
          } else {
            this.productos[index].cantidad = this.productos[index].cantidad + b.cantidad;
          }
          this.productos.sort((ax, bx) => (bx.valor - ax.valor));
        });

        indice++;
        if (indice === numOrdenes) {
          const numeroTope = 10;
          const tope = (this.productos.length > numeroTope) ? numeroTope : this.productos.length;
          for (let i = 0; i < tope; i++) {
            this.pieChartLabels.push(this.productos[i].producto);
            this.pieChartData.push(this.productos[i].cantidad);
            this.reporte.push(this.productos[i]);
          }
          this.loading = false;
        } else {
          this.loading = true;
        }

      });

    });

    /*this.userService.getSellers().subscribe(users => {
      const numVendedores = users.length;
      let indice = 0;
      users.forEach(a => {

        this.ordenService.getOrdenesVendedor(a.payload.doc.id).subscribe(orders => {

          this.vendedor = a.payload.doc.data();

          let totalP = 0;
          let totalF = 0;
          orders.forEach(b => {
            this.orden = b.payload.doc.data();

            if ( this.orden.estado === 'FACTURADA' || this.orden.estado === 'DESPACHADA' ) {
              totalF = totalF + this.orden.total;
            }
            totalP = totalP + this.orden.total;

          });

          this.item = {
            vendedor: this.vendedor.name,
            totalPedido: totalP,
            totalFacturado : totalF
          };

          this.reporte.push(this.item);
          this.reporte.sort((ax, bx) => (bx.total - ax.total));

          this.barChartLabels.push(this.vendedor.name);
          this.barChartData[0].data.push(totalP);
          this.barChartData[1].data.push(totalF);

          indice++;
          (indice === numVendedores) ? this.loading = false : this.loading = true;

        });

      }
      );
    });*/
  }

  public charType(value) {
    switch (value) {
      case 'pie':
        this.ChartLegend = true;
        break;
      case 'bar':
        this.ChartLegend = false;
        break;
      case 'line':
        this.ChartLegend = false;
        break;
      case 'doughnut':
        this.ChartLegend = true;
        break;
      default:
        this.ChartLegend = false;
        break;
    }
  }


}
