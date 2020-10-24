import { BehaviorSubject } from 'rxjs';
import { fillDataShape } from 'src/app/functions/FillDataShape';
import { QuizService } from './../../../services/quiz.service';
import { IUserCategory } from './../../../models/User.model';
import { AcceptDialogService } from './../../../services/accept-dialog.service';
import { CategoryCardPopupComponent } from './../../../components/category-card-popup/category-card-popup.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { title } from 'process';

@Component({
    selector: 'app-page-create-category',
    templateUrl: './page-create-category.component.html',
    styleUrls: ['./page-create-category.component.scss'],
})
export class PageCreateCategoryComponent implements OnInit {
    private loader$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public categories: IUserCategory[] = [];

    constructor(
        private quizService: QuizService,
        public dialog: MatDialog,
        public acceptDialogService: AcceptDialogService
    ) {}

    ngOnInit(): void {
        this.getAllCategories();
    }

    openDialogCategory(category: IUserCategory = null): void {
        const dialogRef = this.dialog.open(CategoryCardPopupComponent, {
            width: '400px',
            data: { category },
        });
        dialogRef.afterClosed().subscribe((result: IUserCategory) => {
            if (!result) {
                return;
            }
            console.log(result);
            if (result.id) {
                this.editCategory(result);
            } else {
                this.createCategory(result);
            }
        });
    }

    getLocalFile(): void {
        this.quizService.loadLocalPack();
    }

    private async getAllCategories(): Promise<void> {
        this.categories = await this.quizService.getAllCategory();
    }

    private async createCategory(category: IUserCategory): Promise<void> {
        this.loader$.next(true);
        const newCategory = await this.quizService.createCategory(category);
        if (newCategory) {
            this.categories.push(newCategory);
        } else {
            console.error('Create category error!');
        }
        this.loader$.next(false);
    }

    private async editCategory(category: IUserCategory): Promise<void> {
        this.loader$.next(true);
        const editCategory = await this.quizService.editCategory(category);
        if (editCategory) {
            const idx = this.categories.findIndex((s) => s.id === editCategory.id);
            this.categories[idx] = editCategory;
        } else {
            console.error('Edit category error!');
        }
        this.loader$.next(false);
    }

    private async deleteCategory(categoryId: number): Promise<void> {
        this.loader$.next(true);
        const deleteCategory = await this.quizService.deleteCategory(categoryId);
        if (deleteCategory) {
            const idx = this.categories.findIndex((s) => s.id === categoryId);
            this.categories.splice(idx, 1);
        } else {
            console.error('Delete category error!');
        }
        this.loader$.next(false);
    }

    categoryCreate(): void {
        const category = fillDataShape(this.quizService.defaultCategory);
        this.openDialogCategory(category);
    }

    categoryEdit(category: IUserCategory): void {
        this.openDialogCategory(category);
    }

    categoryDelete(category: IUserCategory): void {
        this.acceptDialogService.openDialogAccept(
            `Вы уверены, что хотите удалить категорию "${category.title}"?`,
            () => this.deleteCategory(category.id),
        );
    }
}
