import { BehaviorSubject } from 'rxjs';
import { ITesting } from 'src/app/models/Testing.model';
import { QuizService } from './../../../services/quiz.service';
import { AcceptDialogService } from './../../../services/accept-dialog.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubscriptionRxJs } from 'src/app/models/SubscriptionRxJs';
import { MatDialog } from '@angular/material/dialog';
import { TestPopupComponent } from 'src/app/components/test-popup/test-popup.component';

@Component({
  selector: 'app-page-create-test',
  templateUrl: './page-create-test.component.html',
  styleUrls: ['./page-create-test.component.scss']
})
export class PageCreateTestComponent extends SubscriptionRxJs implements OnInit, OnDestroy {

    public listQuiz: ITesting[] = null;
    public activeQuiz: number = null;
    public loader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        public acceptDialogService: AcceptDialogService,
        public quizService: QuizService,
        public dialog: MatDialog,
    ) {
        super();
    }

    ngOnInit(): void {
        this.getData();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getData(): void {
        this.subscriptions.push(
            this.quizService.isQuizPageActive$.subscribe((ref) => {
                if (!ref) {
                    this.fillTestingList();
                }
            }),
            this.quizService.listQuiz$.subscribe((ref) => {
                this.listQuiz = ref;
            })
        );
    }

    async fillTestingList(): Promise<void> {
        const list = await this.quizService.getAllTestings();
        this.quizService.listQuiz$.next(list);
    }

    openDialogTest(): void {
        const dialogRef = this.dialog.open(TestPopupComponent, {
            width: '500px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            this.testCreate(result);
        });
    }

    openDialogDelete(testingId: number): void {
        this.acceptDialogService
            .openDialogAccept(
                'Вы уверены, что хотите удалить тест?',
                () => this.testDelete(testingId),
            );
    }

    async testCreate(result: { title: string, type: 1 | 2 | 3 }): Promise<void> {
        this.loader$.next(true);
        if (!result) {
            return;
        }
        const testing: ITesting = this.quizService.defaultTesting(result.title, result.type);
        const newTesting = await this.quizService.createTesting(testing);
        if (!newTesting) {
            this.loader$.next(false);
            return;
        }
        this.loader$.next(false);
        this.testEdit(newTesting.id);
    }

    async testDelete(testingId: number): Promise<void> {
        this.loader$.next(true);
        if (!await this.quizService.deleteTesting(testingId)) {
            this.fillTestingList();
            this.loader$.next(false);
            return;
        }
        const idx = this.listQuiz.findIndex(q => q.id === testingId);
        this.listQuiz.splice(idx, 1);
        this.loader$.next(false);
    }

    testEdit(quizId: number): void {
        this.activeQuiz = quizId;
        this.quizService.isQuizPageActive$.next(true);
        this.quizService.listQuiz$.next(null);
    }

}
