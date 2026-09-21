import { Injectable } from '@angular/core';
import { GetPagedBody } from '../../interfaces';
import {
    AddServiceBeneficiaryDto,
    ServiceBeneficiaryDto,
    UpdateServiceBeneficiaryDto
} from '../../interfaces/service_beneficiary/service_beneficiary';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class ServiceBeneficiariesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/service_beneficiary/';
    }

    getServiceBeneficiary(id: string) {
        return this.get<ServiceBeneficiaryDto>({ apiName: `Get/${id}` });
    }

    getEditServiceBeneficiary(id: string) {
        return this.get<ServiceBeneficiaryDto>({ apiName: `getEdit/${id}` });
    }

    get serviceBeneficiaries() {
        return this.get<ServiceBeneficiaryDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: true }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.post<any, any>({ apiName: `getpaged`, showAlert: true }, body);
    }

    add(body: AddServiceBeneficiaryDto) {
        return this.post<AddServiceBeneficiaryDto, ServiceBeneficiaryDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateServiceBeneficiaryDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }

    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
