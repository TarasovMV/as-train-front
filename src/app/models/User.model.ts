import { ITestingSet } from './Testing.model';
export interface IUserCategory
{
    id?: number;
    title: string;
    testingSetId?: number;
    set?: ITestingSet;
    file?: IFileModel;
}

export interface IUser {
    id: number;
    userCategoryId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    category: IUserCategory;
}

export interface IFileModel {
    id: number;
    name: string;
    path: string;
}
