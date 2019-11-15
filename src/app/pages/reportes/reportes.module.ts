import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChartsModule } from 'ng2-charts/ng2-charts';


import { ReportesRoutingModule } from './reportes-routing.module';

import { VentasComponent } from './ventas/ventas.component';
import { ProductosComponent } from './productos/productos.component';
import { ConciliadoComponent } from './conciliado/conciliado.component';
import { MetasComponent } from './metas/metas.component';

@NgModule({
  declarations: [
    VentasComponent,
    ProductosComponent,
    ConciliadoComponent,
    MetasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportesRoutingModule,
    NgbModule,
    ChartsModule
  ]
})
export class ReportesModule { }
