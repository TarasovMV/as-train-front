import { BehaviorSubject } from 'rxjs';
import { QuizService } from './../../../services/quiz.service';
import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { SubscriptionRxJs } from 'src/app/models/SubscriptionRxJs';
import { ITestingQuestion, ITesting } from 'src/app/models/Testing.model';

@Component({
    selector: 'app-page-create-test-quiz',
    templateUrl: './page-create-test-quiz.component.html',
    styleUrls: ['./page-create-test-quiz.component.scss'],
})
export class PageCreateTestQuizComponent extends SubscriptionRxJs implements OnInit, OnDestroy, OnChanges {
    @Input() activeTesting = null;

    public data: ITesting = null;
    private activeCardId: number = null;

    public loader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private quizService: QuizService) {
        super();
    }

    ngOnInit(): void {
        this.dataConnect();
    }

    ngOnChanges(): void {
        if (!this.activeTesting) {
            return;
        }
        this.quizService.chooseQuiz(this.activeTesting);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private dataConnect(): void {
        this.subscriptions.push(
            this.quizService.currentQuiz$.subscribe((quiz) => {
                if (!quiz) {
                    return;
                }
                this.data = quiz;
                if (!this.activeCardId) {
                    return;
                }
                const activeCard = this.data.questions.find((qC) => qC.id === this.activeCardId) ?? null;
                if (!activeCard) {
                    return;
                }
                activeCard.isActive = true;
            }),
        );
    }

    public buttonBackToListScreen(): void {
        this.quizService.currentQuiz$.next(null);
        this.quizService.isQuizPageActive$.next(false);
    }

    public cardClick(cardId: number): void {
        this.data.questions.forEach((qC) => qC.isActive = false);
        const activeCard = this.data.questions.find((qC) => qC.id === cardId) ?? null;
        if (!activeCard) {
            return;
        }
        activeCard.isActive = true;
        this.activeCardId = activeCard.id;
    }

    public deleteCard(cardId: number): void {
        this.restRequest(async () => {
            const req = await this.quizService.deleteQuizCard(cardId);
            if (req) {
                const idx = this.data.questions.findIndex((a) => a.id === cardId);
                this.data.questions.splice(idx, 1);
            }
            return req;
        }, '');
    }

    public buttonAddQuestion(): void {
        this.restRequest(async () => {
            const req: ITestingQuestion = await this.quizService.addQuestion(this.data.id);
            if (req) {
                this.data.questions.push(req);
                this.cardClick(req.id);
                return true;
            }
            return false;
        }, '');
    }

    public changeType(): void {
        console.log(this.data.type);
        this.restRequest(() => this.quizService.setQuizType(this.data.type, this.data.id), '');
    }

    public buttonShuffle(event): void {
        this.restRequest(() => this.quizService.setShuffleType(event.checked, this.data.id), '');
    }

    public async blurQuestionTitle(event: string): Promise<void> {
        this.restRequest(() => this.quizService.setQuizTitle(event, this.data.id), '');
    }

    public async blurQuestionTime(event: number): Promise<void> {
        const time = Number(event) <= 0 ? 1800 : Number(event);
        this.restRequest(() => this.quizService.setQuizTime(time, this.data.id), '');
    }

    public async blurQuestionCount(event: number): Promise<void> {
        const count = Number(event) <= 0 ? 1800 : Number(event);
        this.restRequest(() => this.quizService.setQuizCount(count, this.data.id), '');
    }

    private async restRequest(method: () => Promise<boolean>, errorText: string) {
        this.loader$.next(true);
        const request = await method();
        this.loader$.next(false);
        this.errorCheck(request, errorText);
    }

    private errorCheck(isError: boolean, errorText: string): void {
        if (isError) {
            return;
        }
        this.quizService.refreshQuiz();
        console.error(errorText);
    }
}
