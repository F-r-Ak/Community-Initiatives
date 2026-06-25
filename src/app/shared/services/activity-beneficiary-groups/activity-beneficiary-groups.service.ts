import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/services/http/http.service';
import { GetPagedBody } from '../../interfaces';
import { ActivityBeneficiaryGroupDto, AddActivityBeneficiaryGroupDto, UpdateActivityBeneficiaryGroupDto } from '../../interfaces/activity-beneficiary-group/activity-beneficiary-group';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ActivityBeneficiaryGroupsService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/activity_beneficiarygroups/';
    }

    getActivityBeneficiaryGroup(id: string) {
        return this.get<ActivityBeneficiaryGroupDto>({ apiName: `Get/${id}` });
    }

    getEditActivityBeneficiaryGroup(id: string) {
        return this.get<ActivityBeneficiaryGroupDto>({ apiName: `getEdit/${id}` });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddActivityBeneficiaryGroupDto) {
        return this.post<AddActivityBeneficiaryGroupDto, ActivityBeneficiaryGroupDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateActivityBeneficiaryGroupDto) {
        return this.put<UpdateActivityBeneficiaryGroupDto, ActivityBeneficiaryGroupDto>({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `delete/`, showAlert: true }, id);
    }
}
