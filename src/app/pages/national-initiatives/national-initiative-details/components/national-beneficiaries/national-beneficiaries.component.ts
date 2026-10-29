import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions, CentralBeneficiariesService } from '../../../../../shared';
import { AddEditNationalBeneficiaryComponent } from '../add-edit-national-beneficiary/add-edit-national-beneficiary.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-national-beneficiaries',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './national-beneficiaries.component.html',
    styleUrl: './national-beneficiaries.component.scss'
})
export class NationalBeneficiariesComponent extends BaseListComponent implements OnInit {
    @Input() nationalInitiativeDetailId: string = '';
    @Output() totalCountChange = new EventEmitter<number>();

    authHelper = inject(AuthHelper);
    service = inject(CentralBeneficiariesService);

    get rolesEnum() {
        return RoleCodes;
    }

    tableOptions!: TableOptions;

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
                getAll: 'v1/centralbeneficiaries/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/centralbeneficiaries/deletesoft'
            },
            inputCols: [
                { field: 'cityName', header: 'المدينة', filter: true, filterMode: 'text' },
                { field: 'townName', header: 'الحي', filter: true, filterMode: 'text' },
                { field: 'beneficiaryMaleNumber', header: 'عدد الذكور', filter: true, filterMode: 'number' },
                { field: 'beneficiaryFemaleNumber', header: 'عدد الإناث', filter: true, filterMode: 'number' },
                { field: 'totalBeneficiaryNumber', header: 'إجمالي المستفيدين', filter: true, filterMode: 'number' }
            ],
            inputActions: [
                {
                    name: 'EDIT',
                    icon: 'pi pi-file-edit',
                    color: 'text-middle',
                    isCallBack: true,
                    call: (row: any) => this.openAddEditDialog(row),
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
                componentName: 'COMMUNITY-INITIATIVES-NATIONAL-INITIATIVES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: { nationalInitiativeDetailId: this.nationalInitiativeDetailId }
            }
        };
    }

    openAddEditDialog(row?: any) {
        this.openDialog(
            AddEditNationalBeneficiaryComponent,
            row ? 'تعديل مستفيد' : 'إضافة مستفيد',
            { id: row?.id ?? null, nationalInitiativeDetailId: this.nationalInitiativeDetailId, rowData: row }
        );
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
