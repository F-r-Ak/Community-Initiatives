import { Injectable } from '@angular/core';
import { AddDevelopmentServiceDto, DevelopmentServiceDto, UpdateDevelopmentServiceDto, GetPagedBody, InitiativeDto } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class DevelopmentServiceService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/developmentservice/';
    }

    getDevelopmentService(id: string) {
        return this.get<DevelopmentServiceDto>({ apiName: `Get/${id}` });
    }

    getEditDevelopmentService(id: string) {
        return this.get<DevelopmentServiceDto>({ apiName: `getEdit/${id}` });
    }

    get developmentServices() {
        return this.get<DevelopmentServiceDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddDevelopmentServiceDto) {
        return this.post<AddDevelopmentServiceDto, DevelopmentServiceDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateDevelopmentServiceDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    getFieldsDashboardCounts(): Observable<any> {
        return this.get<any>({ apiName: 'getcountbyfield' });
    }

    getCitiesDashboardCounts(): Observable<any> {
        return this.get<any>({ apiName: 'getcountbycity' });
    }

    getInitiativesTotalCount(): Observable<any> {
        return this.get<any>({ apiName: 'getinitiativestotalcount' });
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }

    generateReport(body: any): Observable<any> {
        // Convert body to query parameters
        const params = this.buildQueryParams(body);
        return this.get<any>({ apiName: 'getreport', params });
    }

    downloadReport(body: any): Observable<Blob> {
        // Convert body to query parameters and download as blob
        const params = this.buildQueryParams(body);
        const queryString = new URLSearchParams(params).toString();
        return this.http.get(`${this.domainName}${this.baseUrl}getreport?${queryString}`, {
            responseType: 'blob'
        });
    }

    private buildQueryParams(body: any): any {
        const params: any = {};

        // Map form fields to API parameters
        if (body.reportName) params.ReportName = body.reportName;
        if (body.reportType) params.ReportType = body.reportType;
        if (body.acceptLanguage) params.AcceptLanguage = body.acceptLanguage;

         if (body.name) params.name = body.name;
        if (body.fieldId) {
            if (body.fieldId.nameAr) {
                params.fieldId = body.fieldId.nameAr;
            } else if (typeof body.fieldId === 'string') {
                params.fieldId = body.fieldId;
            }
        }
        if (body.cityId) {
            if (body.cityId.nameAr) {
                params.cityId = body.cityId.nameAr;
            } else if (typeof body.cityId === 'string') {
                params.cityId = body.cityId;
            }
        }
        if (body.InitiativeMangerName) {
            if (body.InitiativeMangerName.name) {
                params.InitiativeMangerName = body.InitiativeMangerName.name;
            } else if (typeof body.InitiativeMangerName === 'string') {
                params.InitiativeMangerName = body.InitiativeMangerName;
            }
        }
        if (body.serviceTypeId) {
            if (body.serviceTypeId.nameEn) {
                params.ServiceType = body.serviceTypeId.nameEn;
            } else if (typeof body.serviceTypeId === 'string') {
                params.ServiceType = body.serviceTypeId;
            }
        }
        return params;
    }
}
