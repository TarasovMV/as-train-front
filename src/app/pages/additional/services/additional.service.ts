import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IParticipant} from '../models/additional.model';
import {ApiAdditionalService} from './api-additional.service';
import {MatDialog} from '@angular/material/dialog';
import {AdditionalParticipantComponent} from '../popups/additional-participant/additional-participant.component';
import {AdditionalCodeComponent} from '../popups/additional-code/additional-code.component';

@Injectable()
export class AdditionalService {
    public participants$: BehaviorSubject<IParticipant[]> = new BehaviorSubject<IParticipant[]>(null);

    constructor(
        private apiAdditionalService: ApiAdditionalService,
        private dialog: MatDialog,
    ) {
    }

    public getExcelReport(): void {
        console.log('getExcelReport');
        this.apiAdditionalService.loadReport();
    }

    public async loadParticipants(): Promise<void> {
        const res = await this.apiAdditionalService.getParticipants();
        this.participants$.next(res);
    }

    public async deleteParticipant(id: number): Promise<void> {
        await this.apiAdditionalService.deleteParticipant(id);
        await this.loadParticipants();
    }

    public async addParticipant(): Promise<void> {
        this.openDialogAdd();
    }

    public async editParticipant(participant: IParticipant): Promise<void> {
        this.openDialogEdit(participant);
    }

    private openDialogAdd(): void {
        const dialogRef = this.dialog.open(AdditionalParticipantComponent, {
            width: '600px',
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            this.apiAdditionalService.addParticipant(result).then(x => {
                this.participants$.next([...this.participants$.getValue(), x]);
            });
        });
    }

    private openDialogEdit(participant: IParticipant): void {
        const dialogRef = this.dialog.open(AdditionalCodeComponent, {
            width: '600px',
            data: participant,
        });
        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            this.apiAdditionalService.editParticipant(participant.id, result).then(x => {
                const participants = this.participants$.getValue();
                const idx = participants.findIndex(p => p.id === x.id);
                if (idx !== -1) {
                    participants[idx] = x;
                }
                this.participants$.next([...participants]);
            });
        });
    }
}
