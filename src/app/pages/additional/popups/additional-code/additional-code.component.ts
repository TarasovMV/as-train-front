import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IParticipant} from '../../models/additional.model';

@Component({
    selector: 'app-additional-code',
    templateUrl: './additional-code.component.html',
    styleUrls: ['./additional-code.component.scss']
})
export class AdditionalCodeComponent implements OnInit {

    public form: FormGroup = new FormGroup({
        code: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });
    public participant: string = '';

    constructor(
        public dialogRef: MatDialogRef<AdditionalCodeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IParticipant,
    ) {}

    public ngOnInit(): void {
        this.participant = `${this.data.lastName} ${this.data.firstName?.[0]}.`;
        if (this.data.middleName?.length > 0) {
            this.participant += `${this.data.middleName?.[0]}.`;
        }
    }

    public accept(): void {
        if (!this.isFormValid(this.form)) {
            return;
        }
        this.dialogRef.close(this.form.value.code);
    }

    public cancel(): void {
        this.dialogRef.close();
    }

    private isFormValid = (form: FormGroup): boolean => {
        form.markAllAsTouched();
        return form.valid;
    }
}
