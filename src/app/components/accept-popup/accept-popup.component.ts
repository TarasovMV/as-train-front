import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-accept-popup',
  templateUrl: './accept-popup.component.html',
  styleUrls: ['./accept-popup.component.scss']
})
export class AcceptPopupComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<AcceptPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
    }

    public onCancelClick(): void {
        this.dialogRef.close(false);
    }

    public onAcceptClick(): void {
        this.dialogRef.close(true);
    }
}
