import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-helper-popup',
    templateUrl: './helper-popup.component.html',
    styleUrls: ['./helper-popup.component.scss']
})
export class HelperPopupComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<HelperPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string
    ) {}

    ngOnInit(): void {
    }

    public close(): void {
        this.dialogRef.close();
    }

}
