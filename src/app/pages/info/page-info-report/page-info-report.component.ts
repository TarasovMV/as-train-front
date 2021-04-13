import { ICompetitionResult } from '../../../models/Testing.model';
import { QuizService } from '../../../services/quiz.service';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {HelperPopupComponent} from '../../../components/helper-popup/helper-popup.component';

interface ICompetitionResultReport extends ICompetitionResult {
    stagesScore?: (number | null)[];
}

@Component({
    selector: 'app-page-info-report',
    templateUrl: './page-info-report.component.html',
    styleUrls: ['./page-info-report.component.scss'],
})
export class PageInfoReportComponent implements OnInit {
    displayedColumns: string[] = [
        'id',
        'lastName',
        'firstName',
        'middleName',
        'stage1',
        'stage2',
        'stage3',
        'stage4',
        'scoreResult',
        'timeResult',
        'report',
        'delete',
    ];
    public dataSource: ICompetitionResultReport[] = [];

    public filterCategories: {id: number, name: string}[] = [];
    public currentFilterId: number = 0;

    public loader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

    public currentResult: number = 0;

    constructor(private quizService: QuizService, private dialog: MatDialog) { }

    public get filterDataSource(): ICompetitionResultReport[] {
        if (!this.currentFilterId) {
            return this.dataSource;
        }
        return this.dataSource.filter((el) => el.user.userCategoryId === this.currentFilterId);
    }

    ngOnInit(): void {
        this.getDataset();
        this.getFilterCategories();
    }

    public getResultTime(id: number): any {
        const result = this.dataSource.find(el => el.id === id);
        return result?.testingsObj?.map(x => x.resultTime).reduce((a, b) => a + b);
    }

    public getStageScore(id: number, idx: number = null): number | string {
        let result = null;
        if (idx !== null) {
            result = this.dataSource.find(el => el.id === id).stagesScore[idx];
        } else {
            const compResult = this.dataSource.find(el => el.id === id);
            result = compResult.stagesScore.some(el => el === null)  ? null : compResult.stagesScore.reduce((a, b) => a + b);
        }
        return (result !== null) ? Math.round(result * 100) / 100 : '-';
    }

    public async getReport(): Promise<void> {
        await this.quizService.loadReport();
    }

    public refreshTable(): void {
        this.getDataset();
    }

    public showResultById(id: number): void {
        this.currentResult = id;
    }

    public closeResult(): void {
        this.currentResult = null;
    }

    private processData(): void {
        this.dataSource?.forEach(res => {
            const stagesScore: number[] = [];
            res.testingsObj?.forEach(testing => {
                const testingScores = res.scores.filter(score => score.testingId === testing.id && score.competitionResultId === res.id);
                if (testingScores.map(el => el.score)?.some((el) => el === null && el !== 0)) {
                    stagesScore.push(null);
                } else {
                    stagesScore.push(testingScores.map(score => score.score).reduce((a, b) => a + b));
                }
            });
            res.stagesScore = stagesScore;
        });
    }

    private async getDataset(): Promise<void> {
        this.loader$.next(true);
        this.dataSource = await this.quizService.getResults();
        this.processData();
        this.loader$.next(false);
        console.log(this.getResultTime(1));
    }

    private async getFilterCategories(): Promise<void> {
        const categories = await this.quizService.getAllCategory();
        this.filterCategories = categories.map((cat) => {
            return {
                id: cat.id,
                name: cat.title,
            };
        });
        this.filterCategories.unshift({id: 0, name: 'Все категории'});
    }

    public async deleteResult(event: any, el: ICompetitionResultReport): Promise<void> {
        event.stopPropagation();
        const dialogRef = this.dialog.open(HelperPopupComponent, {
            width: '350px',
            data: 'Вы уверены, что хотите удалить результат?',
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                await this.quizService.deleteResultById(el.id);
                await this.getDataset();
            }
        });
    }

    public async reportResult(event: any, el: ICompetitionResultReport): Promise<void> {
        event.stopPropagation();
        await this.quizService.loadUserReport(el.id);
    }

    public getNumber(el: ICompetitionResultReport) {
        return this.filterDataSource.findIndex(x => x === el) + 1;
    }

    public sortData(sort: Sort) {
        const data = this.dataSource.slice();
        if (!sort.active || sort.direction === '') {
            this.dataSource = data;
            return;
        }

        this.dataSource = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'position':
                    return compare(a.id, b.id, isAsc);
                case 'lastName':
                    return compare(a.user.lastName, b.user.lastName, isAsc);
                case 'stage1':
                    return compare(a.stagesScore[0], b.stagesScore[0], isAsc);
                case 'stage2':
                    return compare(a.stagesScore[1], b.stagesScore[1], isAsc);
                case 'stage3':
                    return compare(a.stagesScore[2], b.stagesScore[2], isAsc);
                case 'stage4':
                    return compare(a.stagesScore[3], b.stagesScore[3], isAsc);
                case 'scoreResult':
                    return compare(a.stagesScore[0] + a.stagesScore[1] + a.stagesScore[2],
                        b.stagesScore[0] + b.stagesScore[1] + b.stagesScore[2]  + b.stagesScore[3], isAsc);
                case 'timeResult':
                    return compare(this.getResultTime(a.id), this.getResultTime(b.id), isAsc);
                default:
                    return 0;
            }
        });
    }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
