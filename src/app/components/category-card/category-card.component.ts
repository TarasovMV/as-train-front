import { IUserCategory } from './../../models/User.model';
import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {

    @Input() data: IUserCategory = null;

    @Output() delete = new EventEmitter();
    @Output() edit = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    public onDelete(): void {
        this.delete.emit();
    }

    public onEdit(): void {
        this.edit.emit();
    }

}
