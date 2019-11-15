import { Component, OnInit } from '@angular/core';
import { UserService, OrdenService } from '../../../services/service.index';
import { Username } from '../../../models/username';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conciliado',
  templateUrl: './conciliado.component.html',
  styleUrls: ['./conciliado.component.scss']
})
export class ConciliadoComponent implements OnInit {

  loading = true;
  currentDate = new Date();
  inicio: any;
  fin: any;

  datePipe = new DatePipe('en-US');

  vendedor: Username = new Username();
  orden: any;

  reporte = [];
  item = {
    vendedor: '',
    totalPedido: 0,
    totalFacturado: 0,
    porcentaje: 0
  };

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
    this.userService.getSellers().subscribe(users => {
      const numVendedores = users.length;
      let indice = 0;
      this.reporte.splice(0, this.reporte.length);
      this.barChartLabels.splice(0, this.barChartLabels.length);
      this.barChartData[0].data.splice(0, this.barChartData[0].data.length);
      this.barChartData[1].data.splice(0, this.barChartData[1].data.length);
      users.forEach(a => {
        this.ordenService.getOrdenesVendedorFecha(a.payload.doc.id, this.inicio, this.fin).subscribe(orders => {

          this.vendedor = a.payload.doc.data();

          let totalP = 0;
          let totalF = 0;
          orders.forEach(b => {
            this.orden = b.payload.doc.data();

            if (this.orden.estado === 'FACTURADA' || this.orden.estado === 'DESPACHADA') {
              totalF = totalF + this.orden.total;
            }
            totalP = totalP + this.orden.total;

          });

          const per = (totalF * 1) / totalP;

          this.item = {
            vendedor: this.vendedor.name,
            totalPedido: totalP,
            totalFacturado: totalF,
            porcentaje: per ? per : 0
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
    });
  }

}
