import { BehaviorSubject } from 'rxjs';
import { QuizService } from './../../../services/quiz.service';
import { ITestingSet } from './../../../models/Testing.model';
import { SetPopupComponent } from './../../../components/set-popup/set-popup.component';
import { AcceptDialogService } from './../../../services/accept-dialog.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fillDataShape } from 'src/app/functions/FillDataShape';

@Component({
  selector: 'app-page-create-set',
  templateUrl: './page-create-set.component.html',
  styleUrls: ['./page-create-set.component.scss']
})
export class PageCreateSetComponent implements OnInit {

    public setsList: ITestingSet[] = null;
    public loader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    constructor(
        public acceptDialogService: AcceptDialogService,
        public dialog: MatDialog,
        public quizService: QuizService,
    ) { }

    ngOnInit(): void {
        this.getSetsList();
    }

    openDialogSet(isNew: boolean = true, set: ITestingSet): void {
        const dialogRef = this.dialog.open(SetPopupComponent, {
            width: '600px',
            data: { isNew, set }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            if (isNew) {
                this.createSet(result);
            } else {
                this.editSet(result);
            }
        });
    }

    private async getSetsList(): Promise<void> {
        this.setsList = await this.quizService.getAllSet();
        if (!this.setsList) {
            console.error('Get list sets error!');
            this.setsList = [];
        }
    }

    private async createSet(set: ITestingSet): Promise<void> {
        this.loader$.next(true);
        const newSet = await this.quizService.createSet(set);
        if (newSet) {
            this.setsList.push(newSet);
        } else {
            console.error('Create set error!');
        }
        this.loader$.next(false);
    }

    private async editSet(set: ITestingSet): Promise<void> {
        this.loader$.next(true);
        const newSet = await this.quizService.editSet(set);
        if (newSet) {
            const idx = this.setsList.findIndex((s) => s.id === set.id);
            this.setsList[idx] = newSet;
        } else {
            console.error('Edit set error!');
        }
        this.loader$.next(false);
    }

    private async deleteSet(setId: number): Promise<void> {
        this.loader$.next(true);
        if (await this.quizService.deleteSet(setId)) {
            const tempSetIdx = this.setsList.findIndex(s => s.id === setId);
            if (tempSetIdx !== -1) {
                this.setsList.splice(tempSetIdx, 1);
            }
        } else {
            console.error('Delete set error!');
        }
        this.loader$.next(false);
    }

    setDelete(setId: number): void {
        this.acceptDialogService
            .openDialogAccept(
                'Вы уверены, что хотите удалить сет?',
                () => this.deleteSet(setId),
            );
    }

    setEdit(set: ITestingSet): void {
        this.openDialogSet(false, fillDataShape(set));
    }

    setCreate(): void {
        this.openDialogSet(true, fillDataShape(this.quizService.defaultSet));
    }

}
