import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientsComponent } from './clients.component';
import { ProductsComponent } from './products.component';
import { UsersComponent } from './users.component';
import { MetasComponent } from './metas.component';
import { CargaInventarioComponent } from './carga-inventario.component';

const routes: Routes = [
  {
    path: '',
    data: {
        title: 'Administración'
    },
    children: [
        {
            path: '',
            redirectTo: 'clients'
        },
        {
            path: 'clients',
            component: ClientsComponent,
            data: {
            title: 'Clientes'
            }
        },
        {
            path: 'products',
            component: ProductsComponent,
            data: {
            title: 'Productos'
            }
        },
        {
            path: 'users',
            component: UsersComponent,
            data: {
            title: 'Usuarios'
            }
        },
        {
            path: 'metas',
            component: MetasComponent,
            data: {
            title: 'Metas'
            }
        },
        {
            path: 'carga',
            component: CargaInventarioComponent,
            data: {
            title: 'Carga Inventario'
            }
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {}
