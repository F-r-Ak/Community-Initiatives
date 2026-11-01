import { Injectable } from '@angular/core';
import { AddCentralBeneficiaryDto, CentralBeneficiaryDto, UpdateCentralBeneficiaryDto, GetPagedBody } from '../../interfaces';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http/http.service';

@Injectable({
    providedIn: 'root'
})
export class CentralBeneficiariesService extends HttpService {
    protected get baseUrl(): string {
        return 'v1/centralbeneficiaries/';
    }

    getCentralBeneficiary(id: string) {
        return this.get<CentralBeneficiaryDto>({ apiName: `Get/${id}` });
    }

    getEditCentralBeneficiary(id: string) {
        return this.get<CentralBeneficiaryDto>({ apiName: `getEdit/${id}` });
    }

    get centralBeneficiaries() {
        return this.get<CentralBeneficiaryDto[]>({ apiName: 'getAll' });
    }

    getDropDown(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getdropdown`, showAlert: false }, body);
    }

    getPaged(body: GetPagedBody<any>): Observable<any> {
        return this.dropdownPost<any, any>({ apiName: `getpaged`, showAlert: false }, body);
    }

    add(body: AddCentralBeneficiaryDto) {
        return this.post<AddCentralBeneficiaryDto, CentralBeneficiaryDto>({ apiName: 'add', showAlert: true }, body);
    }

    update(body: UpdateCentralBeneficiaryDto) {
        return this.put({ apiName: 'update', showAlert: true }, body);
    }
    
    remove(id: string) {
        return this.delete({ apiName: `deletesoft/`, showAlert: true }, id);
    }
}
