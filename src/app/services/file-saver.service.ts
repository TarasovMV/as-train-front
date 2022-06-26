import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { saveAs } from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class FileSaverService {

    constructor(private http: HttpClient) {}

    public downloadFile(url: string): void {
        this.http.get<any>(url, { responseType: 'blob' as 'json', observe: 'response' }).pipe(
            map((result: HttpResponse<Blob>) => {
                const filename = result.headers.get('Content-Disposition').split(';')[1].trim().split('=')[1];
                saveAs(result.body, filename);
            })).subscribe();
    }
}
