import {Component, OnInit} from '@angular/core';
import {IParticipant} from '../../models/additional.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {AdditionalService} from '../../services/additional.service';
import {map, tap} from 'rxjs/operators';

@Component({
    selector: 'app-additional-table',
    templateUrl: './additional-table.component.html',
    styleUrls: ['./additional-table.component.scss']
})
export class AdditionalTableComponent implements OnInit {

    public readonly displayedColumns: string[] = [
        'id',
        'code',
        'company',
        'lastName',
        'firstName',
        'middleName',
        'timestamp',
        'stage1',
        'stage2',
        'scoreResult',
        'delete',
    ];

    public dataSource$: Observable<IParticipant[]>;

    constructor(private additionalService: AdditionalService) {
        this.dataSource$ = additionalService.participants$.pipe(
            tap(res => res?.filter(x => !!x.result).forEach(x => x.result.allScore = x.result.firstScore + x.result.secondScore)),
        );
    }

    ngOnInit(): void {
        this.additionalService.loadParticipants().then();
    }

    public addResult(event: MouseEvent, participant: IParticipant): void {
        this.additionalService.editParticipant(participant).then();
    }

    public deleteResult(event: MouseEvent, participant: IParticipant): void {
        this.additionalService.deleteParticipant(participant.id).then();
    }
}
