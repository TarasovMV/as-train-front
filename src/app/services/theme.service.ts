import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {

    private isDarkTheme$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public isDarkTheme: Observable<boolean> = this.isDarkTheme$.asObservable();

    constructor() {
        this.theme = localStorage.getItem('theme') === 'true' ? true : false;
    }

    public set theme(value: boolean) {
        localStorage.setItem('theme', value.toString());
        this.isDarkTheme$.next(value);
    }

    public get theme() {
        return this.isDarkTheme$.getValue();
    }
}
