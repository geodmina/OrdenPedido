import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientsComponent } from './clients.component';
import { ProductsComponent } from './products.component';
import { UsersComponent } from './users.component';

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
        }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {}
