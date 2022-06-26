export interface IParticipant {
    id: number;
    participantResultId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    company: string;
    code: string;
    result: IParticipantResult;
}

export interface IParticipantResult {
    firstScore: number;
    secondScore: number;
    allScore?: number;
    timestamp: Date;
}
