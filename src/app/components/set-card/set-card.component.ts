import { ITestingSet } from './../../models/Testing.model';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-set-card',
    templateUrl: './set-card.component.html',
    styleUrls: ['./set-card.component.scss'],
})
export class SetCardComponent implements OnInit, OnChanges {
    @Input() data: ITestingSet = null;

    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    ngOnChanges(): void {
        console.log(this.data);
    }

    public onDelete(): void {
        this.delete.emit();
    }

    public onEdit(): void {
        this.edit.emit();
    }
}
