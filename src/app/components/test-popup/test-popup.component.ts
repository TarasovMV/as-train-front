import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-test-popup',
    templateUrl: './test-popup.component.html',
    styleUrls: ['./test-popup.component.scss'],
})
export class TestPopupComponent implements OnInit {
    public testingTypes = [
        {
            value: 1,
            viewValue: 'Обычное тестирование',
        },
        {
            value: 2,
            viewValue: 'Панорамы',
        },
        {
            value: 3,
            viewValue: 'Виртуальная реальность',
        },
    ];

    title = new FormControl('', [Validators.required]);
    type = new FormControl(null, [Validators.required]);

    constructor(public dialogRef: MatDialogRef<TestPopupComponent>) {}

    ngOnInit(): void {}

    public onCancelClick(): void {
        this.dialogRef.close();
    }

    public onCreateClick(): void {
        if (!this.checkForm()) {
            return;
        }
        const answer = {
            title: this.title.value,
            type: this.type.value,
        };
        this.dialogRef.close(answer);
    }

    private checkForm(): boolean {
        if (!this.title.invalid && !this.type.invalid) {
            return true;
        }
        this.title.markAsTouched();
        this.type.markAsTouched();
        return false;
    }
}
