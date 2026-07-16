import { Injectable } from '@angular/core';
import { AddMediaInitiativeDto, MediaInitiativeDto, UpdateMediaInitiativeDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class MediaInitiativesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/mediainitiatives/';
    }

    getMediaInitiative(id: string) {
        return this.get<MediaInitiativeDto>({ apiName: `Get/${id}` });
    }

    getEditMediaInitiative(id: string) {
        return this.get<MediaInitiativeDto>({ apiName: `getEdit/${id}` });
    }

    get mediaInitiatives() {
        return this.get<MediaInitiativeDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.post<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddMediaInitiativeDto) {
        return this.post<AddMediaInitiativeDto, MediaInitiativeDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateMediaInitiativeDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
