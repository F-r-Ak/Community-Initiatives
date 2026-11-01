import { Injectable } from '@angular/core';
import { AddNationalSupportDto, NationalSupportDto, UpdateNationalSupportDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class NationalSupportsService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/nationalsupports/';
    }

    getNationalSupport(id: string) {
        return this.get<NationalSupportDto>({ apiName: `Get/${id}` });
    }

    getEditNationalSupport(id: string) {
        return this.get<NationalSupportDto>({ apiName: `getEdit/${id}` });
    }

    get nationalSupports() {
        return this.get<NationalSupportDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: false }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: false }, body);
    }

    add(body: AddNationalSupportDto) {
        return this.post<AddNationalSupportDto, NationalSupportDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateNationalSupportDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
