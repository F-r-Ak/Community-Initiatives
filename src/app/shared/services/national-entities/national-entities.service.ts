import { Injectable } from '@angular/core';
import { AddNationalEntityDto, NationalEntityDto, UpdateNationalEntityDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class NationalEntitiesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/nationalentities/';
    }

    getNationalEntity(id: string) {
        return this.get<NationalEntityDto>({ apiName: `Get/${id}` });
    }

    getEditNationalEntity(id: string) {
        return this.get<NationalEntityDto>({ apiName: `getEdit/${id}` });
    }

    get nationalEntities() {
        return this.get<NationalEntityDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: false }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: false }, body);
    }

    add(body: AddNationalEntityDto) {
        return this.post<AddNationalEntityDto, NationalEntityDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateNationalEntityDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
