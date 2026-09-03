import { Injectable } from '@angular/core';
import { EnumDto } from '../../../interfaces';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class DevelopmentEntityTypesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/developmententitytype/';
    }

    get developmentEntityTypes() {
        return this.get<EnumDto[]>({ apiName: 'getAll' });
    }
}
