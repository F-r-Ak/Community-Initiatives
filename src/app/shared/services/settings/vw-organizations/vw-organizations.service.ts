import { Injectable } from '@angular/core';
import { Lookup, GetPagedBody } from '../../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class VwOrganizationsService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/vw_organizations/';
    }

    getVwOrganization(id: string) {
        return this.get<Lookup>({ apiName: `Get/${id}` });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }
}
