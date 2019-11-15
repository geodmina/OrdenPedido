import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentasComponent } from './ventas/ventas.component';
import { ProductosComponent } from './productos/productos.component';
import { ConciliadoComponent } from './conciliado/conciliado.component';
import { MetasComponent } from './metas/metas.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Reportes'
    },
    children: [
        {
            path: '',
            redirectTo: 'ventas'
        },
        { path: 'ventas', component: VentasComponent, data: { title: 'Reporte de ventas' } },
        { path: 'productos', component: ProductosComponent, data: { title: 'Reporte de producto más vendido' } },
        { path: 'conciliado', component: ConciliadoComponent, data: { title: 'Reporte de Facturación' } },
        { path: 'metas', component: MetasComponent, data: { title: 'Reporte de Metas' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule {}
