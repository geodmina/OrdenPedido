import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';

// Components Routing
import { AdministrationRoutingModule } from './administration-routing.module';
import { ProductsComponent } from './products.component';
import { UsersComponent } from './users.component';
import { ClientsComponent } from './clients.component';
import { MetasComponent } from './metas.component';
import { CargaInventarioComponent } from './carga-inventario.component';

@NgModule({
  declarations: [
    ClientsComponent,
    ProductsComponent,
    UsersComponent,
    MetasComponent,
    CargaInventarioComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    FormsModule,
    PopoverModule.forRoot()
  ]
})
export class AdministrationModule { }
