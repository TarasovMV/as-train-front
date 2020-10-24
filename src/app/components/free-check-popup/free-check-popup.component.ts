import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-free-check-popup',
    templateUrl: './free-check-popup.component.html',
    styleUrls: ['./free-check-popup.component.scss'],
})
export class FreeCheckPopupComponent implements OnInit {

    score = new FormControl(0, [Validators.required]);

    constructor(public dialogRef: MatDialogRef<FreeCheckPopupComponent>) {}

    ngOnInit(): void {}

    public onCancelClick(): void {
        this.dialogRef.close();
    }

    public onCreateClick(): void {
        if (!this.checkForm()) {
            return;
        }
        this.dialogRef.close(this.score.value.replace(',', '.'));
    }

    private checkForm(): boolean {
        if (!this.score.invalid) {
            return true;
        }
        this.score.markAsTouched();
        return false;
    }
}
