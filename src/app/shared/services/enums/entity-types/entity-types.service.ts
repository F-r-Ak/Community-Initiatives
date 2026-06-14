import { Injectable } from '@angular/core';
import { EnumDto } from '../../../interfaces';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class EntityTypesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/entitytypes/';
    }

    get entityTypes() {
        return this.get<EnumDto[]>({ apiName: 'getAll' });
    }
}
