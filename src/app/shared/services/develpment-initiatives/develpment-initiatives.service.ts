import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { AddDevelpmentInitiativeDto, GetPagedBody,DevelpmentInitiativeDto,UpdateDevelpmentInitiativeDto } from '../../interfaces';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DevelpmentInitiativesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/developmentinitiative/';
    }

     getDevelpmentInitiative(id: string) {
        return this.get<DevelpmentInitiativeDto>({ apiName: `Get/${id}` });
    }

    getEditDevelpmentInitiative(id: string) {
        return this.get<DevelpmentInitiativeDto>({ apiName: `getEdit/${id}` });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddDevelpmentInitiativeDto) {
        return this.post<AddDevelpmentInitiativeDto, DevelpmentInitiativeDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateDevelpmentInitiativeDto) {
        return this.put<UpdateDevelpmentInitiativeDto, DevelpmentInitiativeDto>({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
