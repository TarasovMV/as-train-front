import { AppConfigService } from './app-config.service';
import { IUserCategory, IFileModel } from './../models/User.model';
import { CategoryCardComponent } from './../components/category-card/category-card.component';
import { ITestingSet, ICompetitionResult } from './../models/Testing.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITestingQuestion, ITesting, ITestingAnswer } from '../models/Testing.model';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root',
})
export class QuizService {
    public currentQuiz$: BehaviorSubject<ITesting> = new BehaviorSubject<ITesting>(null);
    public listQuiz$: BehaviorSubject<ITesting[]> = new BehaviorSubject<ITesting[]>(null);
    public isQuizPageActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private readonly restUrl: string;

    public defaultCategory: IUserCategory = {
        id: null,
        title: null,
    };

    public defaultSet: ITestingSet = {
        title: '',
        stages: [
            {
                title: 'Этап 1',
                testingId: null,
            },
            {
                title: 'Этап 2',
                testingId: null,
            },
            {
                title: 'Этап 3',
                testingId: null,
            },
            {
                title: 'Этап 4',
                testingId: null,
            },
        ],
    };

    public defaultQuestion: ITestingQuestion = {
        title: '',
        type: 1,
        pano: 1,
        vrExperience: 1,
        answers: [],
    };

    public defaultAnswer: ITestingAnswer = {
        title: '',
        isValid: false,
    };

    public defaultTesting(title: string, type: 1 | 2 | 3): ITesting {
        return {
            title,
            type,
            questionsCount: 20,
            time: 1800,
            isShuffleQuestions: true,
        };
    }

    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService,
    ) {
        // this.restUrl = 'http://localhost:5000';
        // this.restUrl = 'http://192.168.1.11:11001';
        this.restUrl = appConfigService.restUrl;
    }

    public async copyTesting(id: number): Promise<void> {
        await this.http.post(`${this.restUrl}/api/testing/testing/copy/${id}`, {}).toPromise();
    }

    public async loadUserReport(id: number): Promise<void> {
        this.downloadFile(`${this.restUrl}/api/report/${id}`);
    }

    public async loadLocalPack(): Promise<void> {
        this.downloadFile(`${this.restUrl}/api/testing/local/file`);
    }

    public async loadReport(): Promise<void> {
        this.downloadFile(`${this.restUrl}/api/report/all`);
    }

    public async uploadFile(categoryId: number, fileToUpload: File): Promise<IFileModel> {
        try {
            const formData: FormData = new FormData();
            formData.append('uploadedFile', fileToUpload, fileToUpload.name);
            return await this.http.post<IFileModel>(`${this.restUrl}/api/file/category/${categoryId}`, formData).toPromise();
        } catch {
            return null;
        }
    }

    public async deleteResultById(id: number): Promise<boolean> {
        try {
            await this.http.delete(`${this.restUrl}/api/testing/result/${id}`).toPromise();
            return true;
        } catch {
            return false;
        }
    }

    public async setQuestionResult(id: number, score: number | null): Promise<boolean> {
        try {
            await this.http.post(`${this.restUrl}/api/testing/score/${id}`, {d: score}).toPromise();
            return true;
        } catch {
            return false;
        }
    }

    public async getResultById(id: number): Promise<ICompetitionResult> {
        try {
            return await this.http.get<ICompetitionResult>(`${this.restUrl}/api/testing/result/${id}`).toPromise();
        } catch {
            return null;
        }
    }

    public async getResults(): Promise<ICompetitionResult[]> {
        try {
            return await this.http.get<ICompetitionResult[]>(`${this.restUrl}/api/testing/result/all`).toPromise();
        } catch {
            return [];
        }
    }

    public async getAllCategory(): Promise<IUserCategory[]> {
        // this.downloadFile(`${this.restUrl}/api/report/2`);
        return await this.getAllCategoryApi();
    }

    public async createCategory(category: IUserCategory): Promise<IUserCategory> {
        return await this.createCategoryApi(category);
    }

    public async editCategory(category: IUserCategory): Promise<IUserCategory> {
        return await this.editCategoryApi(category);
    }

    public async deleteCategory(categoryId: number): Promise<boolean> {
        return await this.deleteCategoryApi(categoryId);
    }

    public async createSet(set: ITestingSet): Promise<ITestingSet> {
        return await this.createSetApi(set);
    }

    public async deleteSet(setId: number): Promise<boolean> {
        return await this.deleteSetApi(setId);
    }

    public async editSet(set: ITestingSet): Promise<ITestingSet> {
        return await this.editSetApi(set, set.id);
    }

    public async getAllSet(): Promise<ITestingSet[]> {
        return await this.getAllSetApi();
    }

    public async createTesting(testing: ITesting): Promise<ITesting> {
        return await this.createTestingApi(testing);
    }

    public async deleteTesting(testingId: number): Promise<boolean> {
        return await this.deleteTestingApi(testingId);
    }

    public async getAllTestings(): Promise<ITesting[]> {
        return await this.getAllTestingsApi();
    }

    public async setShuffleType(isShuffleQuestions: boolean, quizId: number): Promise<boolean> {
        if (!(await this.setShuffleTypeApi(isShuffleQuestions, quizId))) {
            return false;
        }
        return true;
    }

    public async setType(type: number, questionId: number): Promise<boolean> {
        if (!(await this.setMultiplyTypeApi(type, questionId))) {
            return false;
        }
        if (!await this.refreshCard(questionId)) {
            return false;
        }
        return true;
    }

    public async checkAnswer(answerId: number, isChecked: boolean): Promise<boolean> {
        return await this.checkAnswerApi(answerId, isChecked);
    }

    public async setQuizTime(time: number, quizId: number): Promise<boolean> {
        return await this.setQuizTimeApi(time, quizId);
    }

    public async setQuizCount(count: number, quizId: number): Promise<boolean> {
        return await this.setQuizCountApi(count, quizId);
    }

    public async setQuizTitle(title: string, quizId: number): Promise<boolean> {
        return await this.setQuizTitleApi(title, quizId);
    }

    public async setQuizType(type: number, quizId: number): Promise<boolean> {
        return await this.setQuizTypeApi(type, quizId);
    }

    public async setQuestionPano(panoId: number, questionId: number): Promise<boolean> {
        return await this.setQuestionPanoApi(panoId, questionId);
    }

    public async setQuestionVr(vrId: number, questionId: number): Promise<boolean> {
        return await this.setQuestionVrApi(vrId, questionId);
    }

    public async setQuestionTitle(title: string, cardId: number): Promise<boolean> {
        return await this.setQuestionTitleApi(title, cardId);
    }

    public async setAnswerTitle(title: string, answerId: number): Promise<boolean> {
        return await this.setAnswerTitleApi(title, answerId);
    }

    public async deleteAnswer(answerId: number): Promise<boolean> {
        return await this.deleteAnswerApi(answerId);
    }

    public async deleteQuizCard(cardId: number): Promise<boolean> {
        return await this.deleteQuizCardApi(cardId);
    }

    public async addQuestion(testingId: number): Promise<ITestingQuestion> {
        return await this.addQuestionApi(testingId, {...this.defaultQuestion});
    }
    public async addAnswer(questionId: number): Promise<ITestingAnswer> {
        return await this.addAnswerApi(questionId, { ...this.defaultAnswer });
    }

    public async chooseQuiz(id: number): Promise<boolean> {
        try {
            const quiz = await this.getQuizApi(id);
            this.currentQuiz$.next(quiz);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    public refreshQuiz(): void {
        const quizId = this.currentQuiz$.getValue().id;
        if (!quizId) {
            return;
        }
        this.chooseQuiz(quizId);
    }

    public async refreshCard(cardId: number): Promise<boolean> {
        const updQuizCard = await this.getQuizCardApi(cardId);
        if (!updQuizCard) {
            return false;
        }
        const quiz = this.currentQuiz$.getValue();
        const quizCardIdx = quiz.questions.findIndex((qC) => qC.id === cardId) ?? null;
        if (quizCardIdx === null) {
            console.error('Client error: no such card id!');
            return false;
        }
        quiz.questions[quizCardIdx] = {...updQuizCard};
        this.currentQuiz$.next(quiz);
        return true;
    }

    private async getQuizApi(id: number): Promise<ITesting> {
        // return this.http.get<ITesting>('assets/mocks/quiz.json').toPromise();
        return this.http.get<ITesting>(`${this.restUrl}/api/testing/testing/${id}`).toPromise();
    }

    private async getQuizCardApi(questionId: number): Promise<ITestingQuestion> {
        try {
            return await this.http.get<ITestingQuestion>(`${this.restUrl}/api/testing/question/${questionId}`).toPromise();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async deleteQuizCardApi(cardId: number): Promise<boolean> {
        try {
            await this.http.delete(`${this.restUrl}/api/testing/question/${cardId}`).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setQuizTitleApi(title: string, quizId: number): Promise<boolean> {
        const body = {
            title,
        };
        try {
            await this.http.put(`${this.restUrl}/api/testing/testing/title/${quizId}`, body).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setQuizTypeApi(type: number, quizId: number): Promise<boolean> {
        const body = {
            i: type,
        };
        try {
            await this.http.put(`${this.restUrl}/api/testing/testing/type/${quizId}`, body).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setQuestionPanoApi(panoId: number, questionId: number): Promise<boolean> {
        try {
            await this.http.put(`${this.restUrl}/api/testing/question/${questionId}/pano/${panoId}`, null).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setQuestionVrApi(vrId: number, questionId: number): Promise<boolean> {
        try {
            await this.http.put(`${this.restUrl}/api/testing/question/${questionId}/vr/${vrId}`, null).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setQuizTimeApi(time: number, quizId: number): Promise<boolean> {
        const body = {
            i: time,
        };
        try {
            await this.http.put(`${this.restUrl}/api/testing/testing/time/${quizId}`, body).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setQuizCountApi(count: number, quizId: number): Promise<boolean> {
        const body = {
            i: count,
        };
        try {
            await this.http.put(`${this.restUrl}/api/testing/testing/count/${quizId}`, body).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setQuestionTitleApi(title: string, cardId: number): Promise<boolean> {
        const body = {
            title,
        };
        try {
            await this.http.put(`${this.restUrl}/api/testing/question/${cardId}/title`, body).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    // TODO add request
    private async deleteAnswerApi(answerId: number): Promise<boolean> {
        try {
            await this.http.delete(`${this.restUrl}/api/testing/answer/${answerId}`).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setAnswerTitleApi(title: string, answerId: number): Promise<boolean> {
        const body = {
            title,
        };
        try {
            await this.http.put(`${this.restUrl}/api/testing/answer/${answerId}/title`, body).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async checkAnswerApi(answerId: number, isChecked: boolean): Promise<boolean> {
        const body = {
            isActive: isChecked,
        };
        try {
            await this.http.put(`${this.restUrl}/api/testing/answer/${answerId}/valid`, body).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setMultiplyTypeApi(type: number, questionId: number): Promise<boolean> {
        const body = {
            i: type,
        };
        try {
            await this.http.put(`${this.restUrl}/api/testing/question/${questionId}/type/${type}`, null).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async setShuffleTypeApi(isShuffleQuestions: boolean, quizId: number): Promise<boolean> {
        const body = {
            isActive: isShuffleQuestions,
        };
        try {
            await this.http.put(`${this.restUrl}/api/testing/testing/shuffle/${quizId}`, body).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async addQuestionApi(testingId: number, question: ITestingQuestion): Promise<ITestingQuestion> {
        try {
            return await this.http.post<ITestingQuestion>(`${this.restUrl}/api/testing/question/${testingId}`, question).toPromise();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async addAnswerApi(questionId: number, answer: ITestingAnswer): Promise<ITestingAnswer> {
        try {
            return await this.http.post<ITestingAnswer>(`${this.restUrl}/api/testing/answer/${questionId}`, answer).toPromise();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async getAllTestingsApi(): Promise<ITesting[]> {
        try {
            return await this.http.get<ITesting[]>(`${this.restUrl}/api/testing/testing/all`).toPromise();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    private async createTestingApi(testing: ITesting): Promise<ITesting> {
        try {
            return await this.http.post<ITesting>(`${this.restUrl}/api/testing/testing`, testing).toPromise();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async deleteTestingApi(testingId: number): Promise<boolean> {
        try {
            await this.http.delete<ITesting>(`${this.restUrl}/api/testing/testing/${testingId}`).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async createSetApi(set: ITestingSet): Promise<ITestingSet> {
        try {
            return await this.http.post<ITestingSet>(`${this.restUrl}/api/testing/set`, set).toPromise();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async getAllSetApi(): Promise<ITestingSet[]> {
        try {
            return await this.http.get<ITestingSet[]>(`${this.restUrl}/api/testing/set/all`).toPromise();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async deleteSetApi(setId: number): Promise<boolean> {
        try {
            await this.http.delete<ITesting>(`${this.restUrl}/api/testing/set/${setId}`).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async editSetApi(set: ITestingSet, setId: number): Promise<ITestingSet> {
        try {
            return await this.http.put<ITestingSet>(`${this.restUrl}/api/testing/set/${setId}`, set).toPromise();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async createCategoryApi(category: IUserCategory): Promise<IUserCategory> {
        try {
            return await this.http.post<IUserCategory>(`${this.restUrl}/api/user/category`, category).toPromise();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async editCategoryApi(category: IUserCategory): Promise<IUserCategory> {
        try {
            return await this.http.put<IUserCategory>(`${this.restUrl}/api/user/category/${category.id}`, category).toPromise();
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private async deleteCategoryApi(categoryId: number): Promise<boolean> {
        try {
            await this.http.delete(`${this.restUrl}/api/user/category/${categoryId}`).toPromise();
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async getAllCategoryApi(): Promise<IUserCategory[]> {
        try {
            return await this.http.get<IUserCategory[]>(`${this.restUrl}/api/user/category/all`).toPromise();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    // this.downloadFile(`${this.restUrl}/api/report/2`).subscribe(ref => console.log(ref));
    private downloadFile(url: string): void {
        this.http.get<any>(url, { responseType: 'blob' as 'json', observe: 'response' }).pipe(
                map((result: HttpResponse<Blob>) => {
                const filename = result.headers.get('Content-Disposition').split(';')[1].trim().split('=')[1];
                saveAs(result.body, filename);
            })).subscribe();
    }

    private async downloadFileHard(url: string): Promise<void> {
        await saveAs(url);
    }
}
