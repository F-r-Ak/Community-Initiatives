import { Injectable } from '@angular/core';
import { AddTeamMemberDto, TeamMemberDto, UpdateTeamMemberDto, GetPagedBody } from '../../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class TeamMembersService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/teammembers/';
    }

    getTeamMember(id: string) {
        return this.get<TeamMemberDto>({ apiName: `Get/${id}` });
    }

    getEditTeamMember(id: string) {
        return this.get<TeamMemberDto>({ apiName: `getEdit/${id}` });
    }

    get teamMembers() {
        return this.get<TeamMemberDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
       return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddTeamMemberDto) {
        return this.post<AddTeamMemberDto, TeamMemberDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateTeamMemberDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
