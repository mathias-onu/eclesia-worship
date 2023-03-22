import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, typeOfAlert: string) {
    if (typeOfAlert === 'success') {
      this.snackBar.open(message, 'Ok', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top', panelClass: 'success-alert' });
    } else {
      this.snackBar.open(message, 'Ok', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top', panelClass: 'error-alert' });
    }
  }
}
