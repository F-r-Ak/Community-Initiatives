import { Injectable } from '@angular/core';
import { AddInitiativeDto, InitiativeDto, UpdateInitiativeDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class InitiativesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/initiatives/';
    }

    getInitiative(id: string) {
        return this.get<InitiativeDto>({ apiName: `Get/${id}` });
    }

    getEditInitiative(id: string) {
        return this.get<InitiativeDto>({ apiName: `getEdit/${id}` });
    }

    get initiatives() {
        return this.get<InitiativeDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.post<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddInitiativeDto) {
        return this.post<AddInitiativeDto, InitiativeDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateInitiativeDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    getFieldsDashboardCounts(): Observable<any> {
        return this.get<any>({ apiName: 'getcountbyfield' });
    }

    getCitiesDashboardCounts(): Observable<any> {
        return this.get<any>({ apiName: 'getcountbycity' });
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
