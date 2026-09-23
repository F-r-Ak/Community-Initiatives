import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions } from '../../../../../shared';
import { ServiceBeneficiariesService } from '../../../../../shared';
import { AddEditServiceBeneficiaryComponent } from '../add-edit-service-beneficiary/add-edit-service-beneficiary.component';
import { ServiceBeneficiaryComponent } from '../service_beneficiary/service-beneficiary.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-service-beneficiaries',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './service-beneficiaries.component.html',
    styleUrl: './service-beneficiaries.component.scss'
})
export class ServiceBeneficiariesComponent extends BaseListComponent implements OnInit {
    @Input() developmentServiceId: string = '';
    @Output() totalCountChange = new EventEmitter<number>();
    authHelper = inject(AuthHelper);
    get rolesEnum() {
        return RoleCodes;
    }
    tableOptions!: TableOptions;
    service = inject(ServiceBeneficiariesService);

    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initializeTableOptions();
    }

    initializeTableOptions() {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/service_beneficiary/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/service_beneficiary/delete'
            },
            inputCols: [
                { field: 'beneficiaryName', header: 'اسم المستفيد', filter: true, filterMode: 'text' },
                
            ],
            inputActions: [
                {
                    name: 'VIEW',
                    icon: 'pi pi-eye',
                    color: 'text-info',
                    isCallBack: true,
                    call: (row: any) => this.openViewDialog(row),
                    allowAll: true
                },
                {
                    name: 'EDIT',
                    icon: 'pi pi-file-edit',
                    color: 'text-middle',
                    isCallBack: true,
                    call: (row) => this.openAddEditDialog(row),
                    allowAll: true
                },
                this.authHelper.isAdmin
                    ? {
                          name: 'DELETE',
                          icon: 'pi pi-trash',
                          color: 'text-error',
                          allowAll: true,
                          isDelete: true
                      }
                    : {}
            ],
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-ACTIVITIES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: this.authHelper.hasRole(this.rolesEnum.Employee) ? { createdById: this.authHelper.getUserId(), developmentServiceId: this.developmentServiceId } : { developmentServiceId: this.developmentServiceId }
            }
        };
    }

    openAddEditDialog(row?: any) {
        this.openDialog(AddEditServiceBeneficiaryComponent, row ? 'تعديل متابعة ميديا' : 'اضافة متابعة ميديا', { id: row?.id ?? null, developmentServiceId: this.developmentServiceId, rowData: row });
    }

    openViewDialog(rowData: any) {
        this.openDialog(
            ServiceBeneficiaryComponent,
            'عرض متابعة ميديا',
            { pageType: 'view', row: { rowData } },
            { closable: true }
        );
    }

   
    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
