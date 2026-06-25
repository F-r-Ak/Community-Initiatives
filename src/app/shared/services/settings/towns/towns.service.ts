import { Injectable } from '@angular/core';
import { AddTownDto, TownDto, UpdateTownDto, GetPagedBody } from '../../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class TownsService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/towns/';
    }

    getTown(id: string) {
        return this.get<TownDto>({ apiName: `Get/${id}` });
    }

    getEditTown(id: string) {
        return this.get<TownDto>({ apiName: `getEdit/${id}` });
    }

    get towns() {
        return this.get<TownDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddTownDto) {
        return this.post<AddTownDto, TownDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateTownDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
