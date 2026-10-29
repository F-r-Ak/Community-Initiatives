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
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: false }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.post<any, any>({ apiName: `getpaged`, showAlert: false }, body);
    }

    add(body: AddMediaInitiativeDto) {
        return this.post<AddMediaInitiativeDto, MediaInitiativeDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateMediaInitiativeDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
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
        if (body.initiativeName) {
            if (body.initiativeName.name) {
                params.initiativeName = body.initiativeName.name;
            } else if (typeof body.initiativeName === 'string') {
                params.initiativeName = body.initiativeName;
            }
        }

        return params;
    }
}
