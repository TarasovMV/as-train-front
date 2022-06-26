import {Component, OnInit} from '@angular/core';
import {ThemeService} from '../../services/theme.service';

@Component({
    selector: 'app-additional',
    templateUrl: './additional.component.html',
    styleUrls: ['./additional.component.scss']
})
export class AdditionalComponent implements OnInit {

    constructor(private themeService: ThemeService) {}

    ngOnInit(): void {}

    public changeTheme(): void {
        this.themeService.theme = !this.themeService.theme;
    }
}
