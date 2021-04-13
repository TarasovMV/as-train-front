import { ITesting } from 'src/app/models/Testing.model';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.scss']
})
export class TestCardComponent implements OnInit {
    @Input() data: ITesting = null;

    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();
    @Output() coping = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    public onDelete(): void {
        this.delete.emit();
    }

    public onEdit(): void {
        this.edit.emit();
    }

    public onCopy(): void {
        this.coping.emit();
    }

    public getTypeById(id: number): string {
        switch (id) {
            case 1:
                return 'Обычное тестирование';
            case 2:
                return 'Панорамы';
            case 3:
                return 'Виртуальная реальность';
            default:
                return 'Неизвестный тип';
        }
    }
}
