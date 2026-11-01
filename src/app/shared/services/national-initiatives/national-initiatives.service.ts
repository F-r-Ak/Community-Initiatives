import { Injectable } from '@angular/core';
import { AddNationalInitiativeDto, NationalInitiativeDto, UpdateNationalInitiativeDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class NationalInitiativesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/nationalinitiativedetails/';
    }

    getNationalInitiative(id: string) {
        return this.get<NationalInitiativeDto>({ apiName: `Get/${id}` });
    }

    getEditNationalInitiative(id: string) {
        return this.get<NationalInitiativeDto>({ apiName: `getEdit/${id}` });
    }

    get nationalInitiatives() {
        return this.get<NationalInitiativeDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: false }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: false }, body);
    }

    add(body: FormData) {
            return this.post<FormData, NationalInitiativeDto>({ apiName: 'add', showAlert: true }, body);
        }

        update(body: FormData) {
            return this.put<FormData, NationalInitiativeDto>({ apiName: 'update', showAlert: true }, body);
        }

    deleteAttachments(ids: string[]) {
        return this.delete({ apiName: `deleterange/attachments`, showAlert: true }, ids);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
