import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdenComponent } from './orden.component';
import { FacturasComponent } from './facturas/facturas.component';
import { GuiasComponent } from './guias/guias.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Ordenes'
    },
    children: [
        {
            path: '',
            redirectTo: 'orden'
        },
        { path: 'orden', component: OrdenComponent, data: { title: 'Ordenes de Pedido' } },
        { path: 'facturas', component: FacturasComponent, data: { title: 'Facturass' } },
        { path: 'guias', component: GuiasComponent, data: { title: 'Guías de Remisión' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdenesRoutingModule {}
