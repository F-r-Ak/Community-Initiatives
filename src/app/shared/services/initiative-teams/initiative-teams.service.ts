import { Injectable } from '@angular/core';
import { AddInitiativeTeamDto, InitiativeTeamDto, UpdateInitiativeTeamDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class InitiativeTeamsService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/initiativeteams/';
    }

    getInitiativeTeam(id: string) {
        return this.get<InitiativeTeamDto>({ apiName: `Get/${id}` });
    }

    getEditInitiativeTeam(id: string) {
        return this.get<InitiativeTeamDto>({ apiName: `getEdit/${id}` });
    }

    get initiativeTeams() {
        return this.get<InitiativeTeamDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.post<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddInitiativeTeamDto) {
        return this.post<AddInitiativeTeamDto, InitiativeTeamDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateInitiativeTeamDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
