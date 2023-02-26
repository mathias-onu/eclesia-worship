import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule
  ]
})
export class MaterialModule { }
