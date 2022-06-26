import {Component, OnInit} from '@angular/core';
import {AdditionalService} from '../../services/additional.service';

@Component({
    selector: 'app-additional-controls',
    templateUrl: './additional-controls.component.html',
    styleUrls: ['./additional-controls.component.scss']
})
export class AdditionalControlsComponent implements OnInit {

    constructor(private additionalService: AdditionalService) {
    }

    ngOnInit(): void {
    }

    public add(): void {
        this.additionalService.addParticipant().then();
    }

    public refresh(): void {
        this.additionalService.loadParticipants().then();
    }

    public report(): void {
        this.additionalService.getExcelReport();
    }
}
