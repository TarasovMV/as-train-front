import { AcceptPopupComponent } from './../components/accept-popup/accept-popup.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AcceptDialogService {

    constructor(
        public dialog: MatDialog,
    ) { }

    openDialogAccept(question: string, acceptFunction: () => void = null): void {
        const dialogRef = this.dialog.open(AcceptPopupComponent, {
            width: '300px',
            data: { question }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            try {
                acceptFunction();
            } catch {}
        });
    }
}
