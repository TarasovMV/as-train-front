import { FreeCheckPopupComponent } from './../free-check-popup/free-check-popup.component';
import { QuestionResultType } from './../../pages/info/page-info-result/page-info-result.component';
import { ICompetitionResult } from './../../models/Testing.model';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ITestingQuestion, ITestingAnswer } from 'src/app/models/Testing.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-result-card',
    templateUrl: './result-card.component.html',
    styleUrls: ['./result-card.component.scss'],
})
export class ResultCardComponent implements OnInit, OnChanges {

    @Input() idx: number = 0;

    @Input() dataSource: ITestingQuestion = null;

    @Input() quizType: number = 1;

    @Input() questionType: QuestionResultType = 'unknown';

    @Input() score: number = 0;

    @Output() changeQuestionType: EventEmitter<{id: number; score: number}> = new EventEmitter(null);

    questionTypeSave: QuestionResultType = 'unknown';

    public readonly panoramas: {id: number, title: string}[] = [
        {
            id: 1,
            title: 'Проведение огневых работ с применением газорезательного оборудования',
        },
        {
            id: 2,
            title: 'Проведение огневых работ с применением УШМ',
        },
        {
            id: 3,
            title: 'Проведение огневых работ с применением электросварочного оборудования',
        },
        {
            id: 4,
            title: 'Проведение работ на высоте с приставных лестниц',
        },
        {
            id: 5,
            title: 'Работа на высоте',
        },
        {
            id: 6,
            title: 'Работы на высоте с вышки-туры',
        },
        {
            id: 7,
            title: 'Проведение ГОР первой группы с применением изолирующих СИЗОД',
        },
        {
            id: 8,
            title: 'Проведение ГОР в колодце',
        },
        {
            id: 9,
            title: 'Проведение ГОР по зачистке резервуара',
        },
    ];

    public readonly vrScenes: {id: number, title: string}[] = [
        {
            id: 1,
            title: 'Резервуар',
        },
        {
            id: 2,
            title: 'Газовый сепаратор',
        },
        {
            id: 3,
            title: 'Схема ректификации',
        },
        {
            id: 4,
            title: 'Схема компрессора',
        },
        {
            id: 5,
            title: 'Насос',
        },
    ];

    constructor(public dialog: MatDialog, public cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        if (this.dataSource.type === 3 && this.questionType === 'near') {
            this.questionType = 'true';
        }
        this.questionTypeSave = this.questionType;
    }

    get panoTitle(): string {
        return this.panoramas.find((el) => el.id === this.dataSource.pano)?.title ?? '';
    }

    get vrTitle(): string {
        return this.vrScenes.find((el) => el.id === this.dataSource.vrExperience)?.title ?? '';
    }

    public isUserAnswer(answerId: number): boolean {
        if (this.dataSource.type === 3) {
            return false;
        }
        return this.dataSource.result.chooseResult.includes(answerId);
    }

    testClick(): void {
        console.log(this.dataSource);
    }

    getUserAnswerId(): number {
        return this.dataSource.answers.find(el => el.isValid === true)?.id ?? null;
    }

    getCardClassByQuestion(): string {
        return `card__${this.questionType}`;
    }

    async setQuestionResultType(event: QuestionResultType): Promise<void> {
        console.log(this.dataSource.type);
        const body = {
            id: this.dataSource.id,
            score: null,
        };
        switch (event) {
            case 'unknown':
                body.score = null;
                this.changeQuestionType.emit(body);
                break;
            case 'true':
                const dialogRef = this.dialog.open(FreeCheckPopupComponent, {
                    width: '400px',
                });
                dialogRef.afterClosed().subscribe((result: number) => {
                    result = Number(result);
                    if (isNaN(result)) {
                        this.questionType = this.questionTypeSave;
                        return;
                    }
                    body.score = result;
                    this.changeQuestionType.emit(body);
                });
                break;
            case 'false':
                body.score = 0;
                this.changeQuestionType.emit(body);
                break;
        }
    }
}
