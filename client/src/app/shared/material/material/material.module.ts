import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule,
    DragDropModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule,
    DragDropModule,
    MatTabsModule,
    MatSnackBarModule
  ]
})
export class MaterialModule { }
