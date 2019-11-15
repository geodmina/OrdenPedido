import { Component, OnInit } from '@angular/core';
import { Username } from '../../../models/username';
import { DatePipe } from '@angular/common';
import { UserService, OrdenService } from '../../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metas',
  templateUrl: './metas.component.html',
  styleUrls: []
})
export class MetasComponent implements OnInit {

  anio = 0;
  anios = [2019, 2020, 2021];
  mes = 'enero';
  meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'enero', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  loading = true;
  currentDate = new Date();
  inicio: any;
  fin: any;

  datePipe = new DatePipe('en-US');

  vendedor: Username = new Username();
  orden: any;
  metaV: any;

  reporte = [];
  item = {
    vendedor: '',
    totalFacturado: 0,
    meta: 0,
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
    { data: [], label: 'Total Facturado' },
    { data: [], label: 'Meta' }
  ];

  constructor(
    private userService: UserService,
    private ordenService: OrdenService
  ) { }

  ngOnInit() {
    // this.getOrders();
  }

  consultar() {

    if (this.mes === '' || this.anio === 0) {
      this.swal(
        'Error',
        'Debe seleccionar un mes y un año',
        'error'
      );
      return;
    }

    this.getOrders();
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
        this.ordenService.getMetas(a.payload.doc.id, this.anio).subscribe(metas => {
          switch (this.mes) {
            case 'enero':
              this.inicio = '01-01-' + this.anio;
              this.fin = '01-31-' + this.anio;
              break;
            case 'febrero':
              this.inicio = '02-01-' + this.anio;
              this.fin = '02-28-' + this.anio;
              break;
            case 'marzo':
              this.inicio = '03-01-' + this.anio;
              this.fin = '03-31-' + this.anio;
              break;
            case 'abril':
              this.inicio = '04-01-' + this.anio;
              this.fin = '04-30-' + this.anio;
              break;
            case 'mayo':
              this.inicio = '05-01-' + this.anio;
              this.fin = '05-31-' + this.anio;
              break;
            case 'junio':
              this.inicio = '06-01-' + this.anio;
              this.fin = '06-30-' + this.anio;
              break;
            case 'julio':
              this.inicio = '07-01-' + this.anio;
              this.fin = '07-31-' + this.anio;
              break;
            case 'agosto':
              this.inicio = '08-01-' + this.anio;
              this.fin = '08-31-' + this.anio;
              break;
            case 'septiembre':
              this.inicio = '09-01-' + this.anio;
              this.fin = '09-30-' + this.anio;
              break;
            case 'octubre':
              this.inicio = '10-01-' + this.anio;
              this.fin = '10-31-' + this.anio;
              break;
            case 'noviembre':
              this.inicio = '11-01-' + this.anio;
              this.fin = '11-30-' + this.anio;
              break;
            case 'diciembre':
              this.inicio = '12/01' + this.anio;
              this.fin = '12-31/' + this.anio;
              break;
            default:
              this.inicio = '01-01-' + this.anio;
              this.fin = '01-31-' + this.anio;
              break;
          }

          if (metas.length < 1) {
            this.barChartData[1].data.push(0);
          }
          let metaIndi = 0;

          metas.forEach(x => {
            this.metaV = x.payload.doc.data();
            switch (this.mes) {
              case 'enero':
                this.barChartData[1].data.push(this.metaV.metas.enero);
                metaIndi = this.metaV.metas.enero;
                break;
              case 'febrero':
                this.barChartData[1].data.push(this.metaV.metas.febrero);
                metaIndi = this.metaV.metas.febrero;
                break;
              case 'marzo':
                this.barChartData[1].data.push(this.metaV.metas.marzo);
                metaIndi = this.metaV.metas.marzo;
                break;
              case 'abril':
                this.barChartData[1].data.push(this.metaV.metas.abril);
                metaIndi = this.metaV.metas.abril;
                break;
              case 'mayo':
                this.barChartData[1].data.push(this.metaV.metas.mayo);
                metaIndi = this.metaV.metas.mayo;
                break;
              case 'junio':
                this.barChartData[1].data.push(this.metaV.metas.junio);
                metaIndi = this.metaV.metas.junio;
                break;
              case 'julio':
                this.barChartData[1].data.push(this.metaV.metas.julio);
                metaIndi = this.metaV.metas.julio;
                break;
              case 'agosto':
                this.barChartData[1].data.push(this.metaV.metas.agosto);
                metaIndi = this.metaV.metas.agosto;
                break;
              case 'septiembre':
                this.barChartData[1].data.push(this.metaV.metas.septiembre);
                metaIndi = this.metaV.metas.septiembre;
                break;
              case 'octubre':
                this.barChartData[1].data.push(this.metaV.metas.octubre);
                metaIndi = this.metaV.metas.octubre;
                break;
              case 'noviembre':
                this.barChartData[1].data.push(this.metaV.metas.noviembre);
                metaIndi = this.metaV.metas.noviembre;
                break;
              case 'diciembre':
                this.barChartData[1].data.push(this.metaV.metas.diciembre);
                metaIndi = this.metaV.metas.diciembre;
                break;
              default:
                this.barChartData[1].data.push(0);
                metaIndi = 0;
                break;
            }
          });

          this.ordenService.getFacturaPorVendedorFechas(a.payload.doc.id, this.inicio, this.fin).subscribe(orders => {
            this.vendedor = a.payload.doc.data();
            let totalF = 0;
            orders.forEach(b => {
              this.orden = b.payload.doc.data();

              if (this.orden.estado === 'FACTURADA' || this.orden.estado === 'DESPACHADA') {
                totalF = totalF + this.orden.total;
              }

            });

            const per = (totalF * 1) / metaIndi;

            this.item = {
              vendedor: this.vendedor.name,
              totalFacturado: totalF,
              meta: metaIndi,
              porcentaje: per ? per : 0
            };

            this.reporte.push(this.item);
            this.reporte.sort((ax, bx) => (bx.total - ax.total));

            this.barChartLabels.push(this.vendedor.name);
            this.barChartData[0].data.push(totalF);

            indice++;
            (indice === numVendedores) ? this.loading = false : this.loading = true;

          });

        });

      }
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

}
