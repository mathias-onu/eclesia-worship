import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { SplitterModule } from 'primeng/splitter';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { ScrollerModule } from 'primeng/scroller';
import { PickListModule } from 'primeng/picklist';

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
    DynamicDialogModule,
    DividerModule,
    AccordionModule,
    ScrollerModule,
    PickListModule
  ],
  exports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    ToastModule,
    SplitterModule,
    TabViewModule,
    InputTextModule,
    DynamicDialogModule,
    DividerModule,
    AccordionModule,
    ScrollerModule,
    PickListModule
  ],
  providers: [
    MessageService,
    DialogService
  ]
})
export class PrimengModule { }
