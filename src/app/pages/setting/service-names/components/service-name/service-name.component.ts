import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ServiceNamesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-service-name',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './service-name.component.html',
    styleUrl: './service-name.component.scss'
})
export class ServiceNameComponent extends BaseEditComponent implements OnInit {
    serviceNamesService: ServiceNamesService = inject(ServiceNamesService);
    dialogService: DialogService = inject(DialogService);
    city: Lookup | null = null;

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'view') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.id) {
            this.loadCity();
        }
    }

    loadCity(): void {
        this.serviceNamesService.getServiceName(this.id).subscribe((res: Lookup) => {
            this.city = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
