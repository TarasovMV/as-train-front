import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface IAppConfig {
    restUrl: string;
}

@Injectable({
    providedIn: 'root',
})
export class AppConfigService {

    private appConfig: IAppConfig = null;

    constructor(private http: HttpClient) {}

    public async loadAppConfig(): Promise<void> {
        this.appConfig = await this.http.get<IAppConfig>('assets/config.json').toPromise();
    }

    get restUrl(): string {
        if (!this.appConfig) {
            throw Error('Config file not found!');
        }
        return this.appConfig.restUrl;
    }
}
