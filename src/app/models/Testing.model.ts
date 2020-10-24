import { IUser } from './User.model';
import { FormControl } from '@angular/forms';

export interface ITestingSet {
    id?: number;
    title: string;
    titleForm?: FormControl;
    stages: ITestingStage[];
}

export interface ITestingStage {
    id?: number;
    testingSetId?: number;
    testingId: number;
    title: string;
    sortOrder?: number;
    test?: ITesting;
    form?: FormControl;
}

export interface ITesting {
    id?: number;
    title: string;
    type: 1 | 2 | 3;
    isShuffleQuestions: boolean;
    questionsCount: number;
    time: number;
    questions?: ITestingQuestion[];
    modifiedAt?: Date;
    resultTime?: number;
}

export interface ITestingQuestion {
    id?: number;
    title: string;
    type: number; // 1 | 2 | 3; // single | mult | free
    pano: number;
    vrExperience: number;
    answers: ITestingAnswer[];
    result?: ITestingQuestionResult;
    isActive?: boolean;
}

export interface ITestingAnswer {
    id?: number;
    title: string;
    isValid: boolean;
}

export interface ICompetitionResult {
    id: number;
    uid: string;
    userId: number;
    user: IUser;
    testingsObj: ITesting[];
    scores: ITestingScore[];
}

export interface ITestingScore {
    id: number;
    competitionResultId: number;
    testingId: number;
    testingQuestionId: number;
    score?: number;
}

export interface ITestingQuestionResult {
    chooseResult: number[];
    freeResult: string;
}
