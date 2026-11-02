import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions, NationalSupportsService } from '../../../../../shared';
import { AddEditNationalSupportComponent } from '../add-edit-national-support/add-edit-national-support.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-national-supports',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './national-supports.component.html',
    styleUrl: './national-supports.component.scss'
})
export class NationalSupportsComponent extends BaseListComponent implements OnInit {
    @Input() nationalInitiativeDetailId: string = '';
    @Output() totalCountChange = new EventEmitter<number>();

    authHelper = inject(AuthHelper);
    service = inject(NationalSupportsService);

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

    initializeTableOptions(): void {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/nationalsupports/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/nationalsupports/deletesoft'
            },
            inputCols: [
                { field: 'supportNameAr', header: 'نوع الدعم', filter: true, filterMode: 'text' },
                { field: 'supportDetailName', header: 'تفاصيل الدعم', filter: true, filterMode: 'text' },
                { field: 'value', header: 'قيمة الدعم', filter: true, filterMode: 'text' }
            ],
            inputActions: [
                {
                    name: 'VIEW',
                    icon: 'pi pi-eye',
                    color: 'text-info',
                    isCallBack: true,
                    call: (row: any) => this.navigateToView(row),
                    allowAll: true
                },
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

    openAddEditDialog(row?: any): void {
        this.openDialog(
            AddEditNationalSupportComponent,
            row ? 'تعديل دعم مقدم' : 'إضافة دعم مقدم',
            { id: row?.id ?? null, nationalInitiativeDetailId: this.nationalInitiativeDetailId, rowData: row }
        );
    }

    navigateToView(row: any): void {
        this.route.navigate([`/pages/national-initiatives/initiative-details/view-support/${row.id}`]);
    }

    override ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
