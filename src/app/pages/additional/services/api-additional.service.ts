import {Injectable} from '@angular/core';
import {AppConfigService} from '../../../services/app-config.service';
import {IParticipant} from '../models/additional.model';
import {HttpClient} from '@angular/common/http';
import {FileSaverService} from '../../../services/file-saver.service';

@Injectable({
    providedIn: 'root'
})
export class ApiAdditionalService {

    private readonly restUrl: string;
    private readonly restUrlNoPrefix: string;
    constructor(appConfigService: AppConfigService, private http: HttpClient, private fileSaverService: FileSaverService) {
        this.restUrl = `${appConfigService.restUrl}/api/additional`;
        this.restUrlNoPrefix = `${appConfigService.restUrl}`;
    }

    public async getParticipants(): Promise<IParticipant[]> {
        try {
            return await this.http.get<IParticipant[]>(`${this.restUrl}/participant`).toPromise();
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    public loadReport(): void {
        this.fileSaverService.downloadFile(`${this.restUrlNoPrefix}/api/report/additional`);
    }

    public async addParticipant(body: IParticipant): Promise<IParticipant> {
        return await this.http.post<IParticipant>(`${this.restUrl}/participant`, body).toPromise();
    }

    public async editParticipant(id: number, code: string): Promise<IParticipant> {
        return await this.http.get<IParticipant>(`${this.restUrl}/participant/${id}/result/${code}`).toPromise();
    }

    public async deleteParticipant(id: number): Promise<unknown> {
        return await this.http.delete<IParticipant>(`${this.restUrl}/participant/${id}`).toPromise();
    }
}
