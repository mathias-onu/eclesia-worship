import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { SplitterModule } from 'primeng/splitter';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    ToastModule,
    SplitterModule,
    TabViewModule,
    InputTextModule,
    ProgressSpinnerModule,
    DynamicDialogModule,
    DividerModule
  ],
  exports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    ToastModule,
    SplitterModule,
    TabViewModule,
    InputTextModule,
    ProgressSpinnerModule,
    DynamicDialogModule,
    DividerModule
  ],
  providers: [
    MessageService,
    DialogService
  ]
})
export class PrimengModule { }
