import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-additional-participant',
    templateUrl: './additional-participant.component.html',
    styleUrls: ['./additional-participant.component.scss']
})
export class AdditionalParticipantComponent implements OnInit {
    public form: FormGroup = new FormGroup({
        company: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        middleName: new FormControl(''),
        firstName: new FormControl('', [Validators.required]),
    });

    constructor(public dialogRef: MatDialogRef<AdditionalParticipantComponent>) {}

    ngOnInit(): void {
    }

    public accept(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const result = this.form.value;
        this.dialogRef.close(result);
    }

    public cancel(): void {
        this.dialogRef.close();
    }
}
