import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    ToastModule
  ],
  exports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    ToastModule
  ]
})
export class PrimengModule { }
