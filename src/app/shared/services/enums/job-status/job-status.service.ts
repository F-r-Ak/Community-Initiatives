import { Injectable } from '@angular/core';
import { EnumDto } from '../../../interfaces';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class JobStatusService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/jobstatus/';
    }

    get jobStatus() {
        return this.get<EnumDto[]>({ apiName: 'getAll' });
    }
}
