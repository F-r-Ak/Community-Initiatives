import { Injectable } from '@angular/core';
import { AddDevelopServiceAgeDto, UpdateDevelopServiceAgeDto , GetPagedBody, DevelopServiceAgeDto } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class DevelopServiceAgesService extends HttpService {
    protected get baseUrl(): string {
        return 'developserviceages/';
    }

    getDevelopServiceAge(id: string) {
        return this.get<DevelopServiceAgeDto>({ apiName: `Get/${id}` });
    }

    getEditDevelopServiceAge(id: string) {
        return this.get<DevelopServiceAgeDto >({ apiName: `getEdit/${id}` });
    }

    get developServiceAges() {
        return this.get<DevelopServiceAgeDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.post<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddDevelopServiceAgeDto) {
        return this.post<AddDevelopServiceAgeDto, DevelopServiceAgeDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateDevelopServiceAgeDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
