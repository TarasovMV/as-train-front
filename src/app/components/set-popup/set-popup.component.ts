import { QuizService } from '../../services/quiz.service';
import { ITesting } from 'src/app/models/Testing.model';
import { ITestingSet } from '../../models/Testing.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { fillDataShape } from 'src/app/functions/FillDataShape';

const REQUIRED_STAGES = 1;

@Component({
  selector: 'app-set-popup',
  templateUrl: './set-popup.component.html',
  styleUrls: ['./set-popup.component.scss']
})
export class SetPopupComponent implements OnInit {

    public testingsReference: ITesting[] = [];
    public readonly requiredStages = REQUIRED_STAGES;

    constructor(
        public quizService: QuizService,
        public dialogRef: MatDialogRef<SetPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { set: ITestingSet, isNew: boolean }
    ) { }

    ngOnInit(): void {
        this.getTestings();
        this.createFormControl();
    }

    public async getTestings(): Promise<void> {
        this.testingsReference = await this.quizService.getAllTestings();
    }

    public onCancelClick(): void {
        this.dialogRef.close(null);
    }

    public onAcceptClick(): void {
        if (!this.checkForm()) {
            this.highlightErrors();
            return;
        }
        this.data.set.title = this.data.set.titleForm.value;
        this.data.set.stages.map((s) => {
            s.testingId = s.form?.value ?? null;
        });
        const answer = fillDataShape(this.data.set);
        answer.stages.map((s) => {
            s.form = null;
        });
        answer.stages = answer.stages.filter((stages) => stages.testingId !== null);
        answer.titleForm = null;
        this.dialogRef.close(answer);
    }

    createFormControl(): void {
        this.data.set.titleForm = new FormControl(this.data.set.title, [Validators.required]);
        this.data.set.stages.forEach((s, idx) => {
            if (idx >= REQUIRED_STAGES) {
                s.form = new FormControl(s.testingId, Validators.nullValidator);
                return;
            }
            s.form = new FormControl(s.testingId, Validators.required);
        });
    }

    private checkForm(): boolean {
        if (this.data.set.titleForm.invalid) {
            return false;
        }
        for (const stage of this.data.set.stages) {
            if (!stage.form?.valid && stage.form?.validator({} as AbstractControl)?.required) {
                return false;
            }
        }
        return true;
    }

    private highlightErrors(): void {
        this.data.set.titleForm.markAsTouched();
        this.data.set.stages.filter((s) => s.form.validator({} as AbstractControl)?.required).forEach((s) => s.form.markAsTouched());
    }
}
