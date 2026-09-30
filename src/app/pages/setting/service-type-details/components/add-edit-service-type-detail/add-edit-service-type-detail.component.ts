import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, ServiceTypeDetailsService ,ServiceNamesService , PrimeAutoCompleteComponent } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
    selector: 'app-add-edit-service-type-detail',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent , PrimeAutoCompleteComponent],
    templateUrl: './add-edit-service-type-detail.component.html',
    styleUrl: './add-edit-service-type-detail.component.scss'
})
export class AddEditServiceTypeDetailComponent extends BaseEditComponent implements OnInit {
    serviceTypeDetailsService: ServiceTypeDetailsService = inject(ServiceTypeDetailsService);
    serviceNamesService: ServiceNamesService = inject(ServiceNamesService);
    dialogService: DialogService = inject(DialogService);

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }


   selectedServiceName: any = null;
    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.pageType === 'edit') {
            this.getEditServiceTypeDetail();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            nameAr: ['', Validators.required],
            serviceNameId: [null, Validators.required]
        });
    }
 getServiceNames(body: any) {
        return this.serviceNamesService.getPaged(body);
    }

    onServiceNameSelect(event: any) {
        this.selectedServiceName = event?.value ?? null;
        this.form.get('serviceNameId')?.setValue(this.selectedServiceName?.id ?? null);
    }
    getEditServiceTypeDetail = () => {
        this.serviceTypeDetailsService.getEditServiceTypeDetails(this.id).subscribe((serviceTypeDetail: any) => {
            this.initFormGroup();
            this.form.patchValue(serviceTypeDetail);
             if (serviceTypeDetail.serviceNameId) {
                this.serviceNamesService.getEditServiceName(serviceTypeDetail.serviceNameId).subscribe((serviceName) => (this.selectedServiceName = serviceName));
            }
        });
    };

    submit() {
        if (this.pageType === 'add')
            this.serviceTypeDetailsService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.serviceTypeDetailsService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.closeDialog();
            });
    }

    override redirect() {
        if (this.dialogService.dialogComponentRefMap.size > 0) {
            this.closeDialog();
        } else {
            const currentRoute = this.route.url;
            const index = currentRoute.lastIndexOf('/');
            const str = currentRoute.substring(0, index);
            this.route.navigate([str]);
        }
    }

    closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
