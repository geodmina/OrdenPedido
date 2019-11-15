import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { OrdenesRoutingModule } from './ordenes-routing.module';
import { OrdenComponent } from './orden.component';
import { FacturasComponent } from './facturas/facturas.component';
import { GuiasComponent } from './guias/guias.component';

@NgModule({
  declarations: [
    OrdenComponent,
    FacturasComponent,
    GuiasComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    OrdenesRoutingModule
  ]
})
export class OrdenesModule { }
