import { BehaviorSubject } from 'rxjs';
import { QuizService } from './../../services/quiz.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITestingQuestion, ITestingAnswer } from 'src/app/models/Testing.model';

@Component({
    selector: 'app-quiz-card',
    templateUrl: './quiz-card.component.html',
    styleUrls: ['./quiz-card.component.scss'],
})
export class QuizCardComponent implements OnInit {
    @Input() idx: number = 0;
    @Input() quizType: number = 1;
    @Input() isActive: boolean = false;
    @Input() data: ITestingQuestion = {
        title: '',
        pano: 1,
        vrExperience: 1,
        type: 1,
        answers: [],
    };

    @Output() deleteCard: EventEmitter<number> = new EventEmitter<number>();

    public loader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    // public readonly panoramas: {id: number, title: string}[] = [
    //     {
    //         id: 1,
    //         title: 'Налив нефтепродукта в железнодорожную цистерну',
    //     },
    //     {
    //         id: 2,
    //         title: 'Налив нефтепродукта в атоцистерну',
    //     },
    //     {
    //         id: 3,
    //         title: 'Выполнение газоопасных работ',
    //     },
    //     {
    //         id: 4,
    //         title: 'Выполнение маневровых работ',
    //     },
    //     {
    //         id: 5,
    //         title: 'Проведение ремонтных работ в локомотивном депо',
    //     },
    //     {
    //         id: 6,
    //         title: 'Выполнение работ на высоте',
    //     },
    //     {
    //         id: 7,
    //         title: 'Налив нефтепродукта в железнодорожную цистерну 2',
    //     },
    //     {
    //         id: 8,
    //         title: 'Работы на железнодорожных путях бригадой монтеров пути',
    //     },
    //     {
    //         id: 9,
    //         title: 'Выполнение огневых работ',
    //     },
    // ];

    public readonly panoramas: {id: number, title: string}[] = [
        {
            id: 1,
            title: 'Проведение огневых работ с применением газорезательного оборудования.',
        },
        {
            id: 2,
            title: 'Проведение огневых работ с применением УШМ. Вид 1.',
        },
        {
            id: 3,
            title: 'Проведение огневых работ с применением электросварочного оборудования.',
        },
        {
            id: 4,
            title: 'Проведение работ на высоте с приставных лестниц.',
        },
        {
            id: 5,
            title: 'Работа на высоте. Вид 1.',
        },
        {
            id: 6,
            title: 'Работы на высоте с вышки-туры.',
        },
        {
            id: 7,
            title: 'Проведение ГОР первой группы с применением изолирующих СИЗОД.',
        },
        {
            id: 8,
            title: 'Проведение ГОР в колодце.',
        },
        {
            id: 9,
            title: 'Проведение ГОР по зачистке резервуара',
        },
        {
            id: 10,
            title: 'Работы на высоте. Вид 2.',
        },
        {
            id: 11,
            title: 'Работы на высоте. Вид 3.',
        },
        {
            id: 12,
            title: 'Работы на высоте. Вид 4.',
        },
        {
            id: 13,
            title: 'Прокачка импульсных линий.',
        },
        {
            id: 14,
            title: 'Огневые работы с применением УШМ. Вид 2.',
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

    constructor(private quizService: QuizService) {}

    ngOnInit(): void {}

    buttonDeleteCard(): void {
        this.deleteCard.emit(this.data.id);
    }

    buttonAddAnswer(): void {
        this.restRequest(async () => {
            const req: ITestingAnswer = await this.quizService.addAnswer(this.data.id);
            if (req) {
                this.data.answers.push(req);
                return true;
            }
            return false;
        }, '');
    }

    async buttonDeleteAnswer(answerId: number): Promise<void> {
        this.restRequest(async () => {
            const req = await this.quizService.deleteAnswer(answerId);
            if (req) {
                const idx = this.data.answers.findIndex((a) => a.id === answerId);
                this.data.answers.splice(idx, 1);
            }
            return req;
        }, '');
    }

    async blurQuestionTitle(event: string): Promise<void> {
        this.restRequest(() => this.quizService.setQuestionTitle(event, this.data.id), '');
    }

    async blurAnswerTitle(event: string, answerId: number): Promise<void> {
        this.restRequest(() => this.quizService.setAnswerTitle(event, answerId), '');
    }

    async toggleMultiply(event): Promise<void> {
        this.restRequest(() => this.quizService.setType(event.checked, this.data.id), '');
    }

    async toggleType(event): Promise<void> {
        this.data.type = Number(event.value);
        this.restRequest(() => this.quizService.setType(this.data.type, this.data.id), '');
    }

    changePano(): void {
        this.restRequest(() => this.quizService.setQuestionPano(this.data.pano, this.data.id), '');
    }

    changeVr(): void {
        this.restRequest(() => this.quizService.setQuestionVr(this.data.vrExperience, this.data.id), '');
    }

    async buttonCheckAnswer(answer: ITestingAnswer): Promise<void> {
        console.log(answer);
        console.log(this.data);
        let isChecked = answer.isValid;
        if (this.data.type === 1) {
            isChecked = !answer.isValid;
            this.data.answers.forEach((a) => a.isValid = false);
            answer.isValid = isChecked;
        }
        this.restRequest(() => this.quizService.checkAnswer(answer.id, isChecked), '');
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
        this.quizService.refreshCard(this.data.id);
        console.error(errorText);
    }
}
