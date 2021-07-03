import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private _snackBar: MatSnackBar) {}

  showErrorSnackBar(
    message: string,
    action?: string,
    config?: MatSnackBarConfig
  ) {
    this._snackBar.open(message, action, {
      duration: 3000,
      panelClass: 'bg-red-600',
      ...config,
    });
  }
}
