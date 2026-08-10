import { Injectable } from '@angular/core';
import { HttpService } from '../../../../core/services/http/http.service';
import { GetPagedBody } from '../../../interfaces';
import { EntityDto, AddEntityDto, UpdateEntityDto } from '../../../interfaces/entity/entity';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EntitiesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/entities/';
    }

    getEntity(id: string) {
        return this.get<EntityDto>({ apiName: `Get/${id}` });
    }

    getEditEntity(id: string) {
        return this.get<EntityDto>({ apiName: `getEdit/${id}` });
    }

    get entities() {
        return this.get<EntityDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddEntityDto) {
        return this.post<AddEntityDto, EntityDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateEntityDto) {
        return this.put<UpdateEntityDto, EntityDto>({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
