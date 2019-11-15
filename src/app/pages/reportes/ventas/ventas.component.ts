import { Component, OnInit } from '@angular/core';
import { UserService, OrdenService } from '../../../services/service.index';
import { Username } from '../../../models/username';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

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
    total: 0
  };

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType = 'pie';
  public ChartLegend = true;


  constructor(
    private userService: UserService,
    private ordenService: OrdenService
  ) { }

  ngOnInit() {
    this.inicio = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.fin = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.getSellers();
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
    this.getSellers();
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

  getSellers() {
    this.userService.getSellers().subscribe(users => {
      const numVendedores = users.length;
      let indice = 0;
      this.reporte.splice(0, this.reporte.length);
      this.pieChartLabels.splice(0, this.pieChartLabels.length);
      this.pieChartData.splice(0, this.pieChartData.length);
      users.forEach(a => {

        this.ordenService.getFacturaPorVendedorFechas(a.payload.doc.id, this.inicio, this.fin).subscribe(orders => {

          this.vendedor = a.payload.doc.data();

          let total = 0;
          orders.forEach(b => {
            this.orden = b.payload.doc.data();

            if (this.orden.estado === 'FACTURADA' || this.orden.estado === 'DESPACHADA') {
              total = total + this.orden.total;
            }

          });

          this.item = {
            vendedor: this.vendedor.name,
            total: total
          };

          this.reporte.push(this.item);
          this.reporte.sort((ax, bx) => (bx.total - ax.total));

          this.pieChartLabels.push(this.vendedor.name);
          this.pieChartData.push(total);

          indice++;
          (indice === numVendedores) ? this.loading = false : this.loading = true;

        });

      }
      );
    });
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

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }


}
