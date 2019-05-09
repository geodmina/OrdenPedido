import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ClientService,
  UserService,
  ProductService
 } from './service.index';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ClientService,
    UserService,
    ProductService
  ],
  declarations: []
})

export class ServicesModule { }
