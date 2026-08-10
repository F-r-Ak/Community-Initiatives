import { Injectable } from '@angular/core';
import { AddActivityDto, ActivityDto, UpdateActivityDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';
import { HttpParams } from '@angular/common/http';

export interface ActivityReportFilter {
    Name?: string;
    CityId?: string;
    CityName?: string;
    ActivityStartDate?: string;
    ActivityEndDate?: string;
    ReportName: string;
    ReportType: 'pdf' | 'excel';
}

@Injectable({
    providedIn: 'root'
})
export class ActivitiesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/activities/';
    }

    public getBaseUrl(): string {
        return this.baseUrl;
    }

    getActivity(id: string) {
        return this.get<ActivityDto>({ apiName: `Get/${id}` });
    }

    getEditActivity(id: string) {
        return this.get<ActivityDto>({ apiName: `getEdit/${id}` });
    }

    get activities() {
        return this.get<ActivityDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    getExecutionStatusDashboardCounts(): Observable<any> {
        return this.get<any>({ apiName: 'getcountbyexecutionstatus' });
    }

    getCitiesActivitiesDashboardCounts(): Observable<any> {
        return this.get<any>({ apiName: 'getcountactivitiesbycity' })

    }

    getActivitiesTotalCount(): Observable<any> {
        return this.get<any>({ apiName: 'getactivitiestotalcount' });
    }

    getBeneficiariesStatistics(): Observable<any> {
        return this.get<any>({ apiName: 'beneficiaries-statistics' });
    }

    getTotalBeneficiaries(): Observable<any> {
        return this.get<any>({ apiName: 'initiatives/total-beneficiaries' });
    }

    add(body: FormData) {
        return this.post<FormData, ActivityDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: FormData) {
        return this.put<FormData, ActivityDto>({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }

    deleteAttachments(ids: string[]) {
        return this.delete({ apiName: `deleterange/attachments`, showAlert: true }, ids);
    }

    getReport(filter: ActivityReportFilter): Observable<Blob> {
        let params = new HttpParams()
            .set('ReportName', filter.ReportName)
            .set('ReportType', filter.ReportType);

        if (filter.Name) params = params.set('Name', filter.Name);
        if (filter.CityId) params = params.set('CityId', filter.CityId);
        if (filter.CityName) params = params.set('CityName', filter.CityName);
        if (filter.ActivityStartDate) params = params.set('ActivityStartDate', filter.ActivityStartDate);
        if (filter.ActivityEndDate) params = params.set('ActivityEndDate', filter.ActivityEndDate);

        return this.http.get(`${this.domainName}${this.baseUrl}getreport`, {
            params,
            responseType: 'blob'
        });
    }
}
