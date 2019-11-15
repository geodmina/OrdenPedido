import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ClientService,
  UserService,
  ProductService,
  OrdenService
 } from './service.index';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ClientService,
    UserService,
    ProductService,
    OrdenService
  ],
  declarations: []
})

export class ServicesModule { }
