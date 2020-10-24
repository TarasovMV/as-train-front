import { ThemeService } from './../../services/theme.service';
import { Component, OnInit } from '@angular/core';

export type PageType = 'dashboard' | 'control';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
    constructor(private themeService: ThemeService) {}

    pageType: PageType = 'dashboard';
    pageTypeNum: number = 1;

    ngOnInit(): void {}

    changeTheme(): void {
        this.themeService.theme = !this.themeService.theme;
    }
}
