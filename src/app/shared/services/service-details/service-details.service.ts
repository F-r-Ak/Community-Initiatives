import { Injectable } from '@angular/core';
import { AddServiceDetailDto, ServiceDetailDto, UpdateServiceDetailDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class ServiceDetailsService extends HttpService {
    protected get baseUrl(): string {
        return 'service_details/';
    }

    getServiceDetail(id: string) {
        return this.get<ServiceDetailDto>({ apiName: `Get/${id}` });
    }

    getEditServiceDetail(id: string) {
        return this.get<ServiceDetailDto>({ apiName: `getEdit/${id}` });
    }

    get serviceDetails() {
        return this.get<ServiceDetailDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.post<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddServiceDetailDto) {
        return this.post<AddServiceDetailDto, ServiceDetailDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateServiceDetailDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
