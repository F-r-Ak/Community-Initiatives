import { Injectable } from '@angular/core';
import { AddServiceDevelopmentEntityDto,  UpdateServiceDevelopmentEntityDto, GetPagedBody, ServiceDevelopmentEntityDto } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class ServiceDevelopmentEntitiesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/servicedevelopmententities/';
    }

    getServiceDevelopmentEntity(id: string) {
        return this.get<ServiceDevelopmentEntityDto>({ apiName: `Get/${id}` });
    }

    getEditServiceDevelopmentEntity(id: string) {
        return this.get<ServiceDevelopmentEntityDto >({ apiName: `getEdit/${id}` });
    }

    get serviceDevelopmentEntities() {
        return this.get<ServiceDevelopmentEntityDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.post<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddServiceDevelopmentEntityDto) {
        return this.post<AddServiceDevelopmentEntityDto, ServiceDevelopmentEntityDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateServiceDevelopmentEntityDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
