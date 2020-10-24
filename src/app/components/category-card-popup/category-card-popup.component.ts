import { QuizService } from './../../services/quiz.service';
import { ITestingSet } from './../../models/Testing.model';
import { FormControl, Validators } from '@angular/forms';
import { IUserCategory } from './../../models/User.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-category-card-popup',
  templateUrl: './category-card-popup.component.html',
  styleUrls: ['./category-card-popup.component.scss']
})
export class CategoryCardPopupComponent implements OnInit {

    public titleForm: FormControl;
    public setForm: FormControl;
    public sets: ITestingSet[] = [];

    constructor(
        private quizService: QuizService,
        public dialogRef: MatDialogRef<CategoryCardPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { category: IUserCategory },
    ) { }

    public ngOnInit(): void {
        this.createFormControl();
        this.getSetsList();
    }

    public onCancelClick(): void {
        this.dialogRef.close(null);
    }

    public onAcceptClick(): void {
        if (!this.checkForm()) {
            this.highlightErrors();
            return;
        }
        const answer: IUserCategory = {
            id: this.data.category.id ?? undefined,
            title: this.titleForm.value,
            testingSetId: this.setForm.value,
        };
        this.dialogRef.close(answer);
    }

    public async handleFileInput(files: FileList): Promise<void> {
        if (!files[0] || !this.data.category.id) {
            return;
        }
        const file = await this.quizService.uploadFile(this.data.category.id, files[0]);
        if (!file) {
            console.error('file not save');
            return;
        }
        this.data.category.file = file;
    }

    private createFormControl(): void {
        this.titleForm = new FormControl(this.data.category.title, [Validators.required]);
        this.setForm = new FormControl(this.data.category.testingSetId, [Validators.required]);
    }

    private checkForm(): boolean {
        if (!this.titleForm.invalid && !this.setForm.invalid) {
            return true;
        }
        return false;
    }

    private highlightErrors(): void {
        this.titleForm.markAsTouched();
        this.setForm.markAsTouched();
    }

    private async getSetsList(): Promise<void> {
        this.sets = await this.quizService.getAllSet();
    }
}
