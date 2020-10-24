import { ThemeService } from './services/theme.service';
import { Component, HostBinding, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private themeService: ThemeService,
        private renderer: Renderer2
    ) {
        themeService.isDarkTheme.subscribe(this.switchTheme.bind(this));
    }

    // @HostBinding('class')
    // get themeMod() {
    //     return this.themeService.theme ? 'theme-dark' : 'theme-light';
    // }

    switchTheme(isDarkMode: boolean): void {
        const hostClass = isDarkMode ? 'theme-dark' : 'theme-light';
        this.renderer.setAttribute(this.document.body, 'class', hostClass);
    }
}
