import { BehaviorSubject } from 'rxjs';
import { ICompetitionResult } from './../../../models/Testing.model';
import { QuizService } from './../../../services/quiz.service';
import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';

export type QuestionResultType = 'unknown' | 'true' | 'false' | 'near';

@Component({
    selector: 'app-page-info-result',
    templateUrl: './page-info-result.component.html',
    styleUrls: ['./page-info-result.component.scss'],
})
export class PageInfoResultComponent implements OnInit, AfterViewInit {

    @Output() closeEvent: EventEmitter<number> = new EventEmitter<number>();

    @Input() id: number = 0;

    public dataSource: ICompetitionResult = null;

    public loader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    constructor(private quizService: QuizService) {}

    ngOnInit(): void {
        this.getData();
    }

    ngAfterViewInit() {
    }

    private async getData(): Promise<void> {
        if (!this.id) {
            return;
        }
        this.loader$.next(true);
        this.dataSource = await this.quizService.getResultById(this.id);
        this.loader$.next(false);
    }

    public getScoreByTesting(testingId: number): number | string {
        if (this.dataSource.scores.filter(x => x.testingId === testingId).map(x => x.score).some(x => x === null)) {
            return '-';
        }
        return this.dataSource.scores.filter(x => x.testingId === testingId).map(x => x.score).reduce((a, b) => a + b);
    }

    public backToTable(): void {
        this.closeEvent.emit(this.id);
    }

    public getQuestionType(questionId: number): QuestionResultType {
        const questionScore = this.dataSource.scores.find((score) => score.testingQuestionId === questionId).score;
        if (questionScore === null) {
            return 'unknown';
        } else if (questionScore === 1) {
            return 'true';
        } else if (questionScore === 0) {
            return 'false';
        } else {
            return 'near';
        }
    }

    public getQuestionScore(questionId: number): number {
        const questionScore = this.dataSource.scores.find((score) => score.testingQuestionId === questionId).score;
        return questionScore;
    }

    public async setQuestionType(event): Promise<void> {
        const testingScore = this.dataSource.scores.find((score) => score.testingQuestionId === event.id);
        if (!testingScore) {
            return;
        }
        if (!(await this.quizService.setQuestionResult(testingScore.id, event.score))) {
            return;
        }
        testingScore.score = event.score;
    }
}
