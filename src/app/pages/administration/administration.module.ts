import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components Routing
import { AdministrationRoutingModule } from './administration-routing.module';
import { ProductsComponent } from './products.component';
import { UsersComponent } from './users.component';
import { ClientsComponent } from './clients.component';

@NgModule({
  declarations: [
    ClientsComponent,
    ProductsComponent,
    UsersComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    FormsModule
  ]
})
export class AdministrationModule { }
