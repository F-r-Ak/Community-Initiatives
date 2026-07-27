import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { GetPagedBody } from '../../interfaces';
import { ActivityEntityDto, AddActivityEntityDto, UpdateActivityEntityDto } from '../../interfaces/activity-entity/activity-entity';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ActivityEntitiesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/activity_entities/';
    }

    getActivityEntity(id: string) {
        return this.get<ActivityEntityDto>({ apiName: `Get/${id}` });
    }

    getEditActivityEntity(id: string) {
        return this.get<ActivityEntityDto>({ apiName: `getEdit/${id}` });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddActivityEntityDto) {
        return this.post<AddActivityEntityDto, ActivityEntityDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateActivityEntityDto) {
        return this.put<UpdateActivityEntityDto, ActivityEntityDto>({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
