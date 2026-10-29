import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, TableOptions } from '../../../../../shared';
import { NationalInitiativesService } from '../../../../../shared';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-national-initiative-details',
    imports: [RouterModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './national-initiative-details.component.html',
    styleUrl: './national-initiative-details.component.scss'
})
export class NationalInitiativeDetailsComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    authHelper = inject(AuthHelper);
    service = inject(NationalInitiativesService);
    get rolesEnum() {
        return RoleCodes;
    }
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
                getAll: 'v1/nationalinitiativedetails/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/nationalinitiativedetails/delete'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-INITIATIVES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: this.authHelper.hasRole(this.rolesEnum.Employee) ? { createdById: this.authHelper.getUserId() } : {}
            },
            responsiveDisplayedProperties: ['developmentInitiativeName', 'beneficiaryGroupName', 'ExecuteTypeName', 'ExecutionStatusName']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            { field: 'developmentInitiativeName', header: 'اسم المبادرة', filter: true, filterMode: 'text' },
            { field: 'beneficiaryGroupName', header: 'الفئة المستهدفة', filter: true, filterMode: 'text' },
            { field: 'ExecuteTypeName', header: 'نطاق التنفيذ', filter: true, filterMode: 'text' },
            { field: 'ExecutionStatusName', header: 'الموقف التنفيذي', filter: true, filterMode: 'text' }
        ];
    }

    initializeTableActions(): TableOptions['inputActions'] {
        return [
            {
                name: 'VIEW',
                icon: 'pi pi-eye',
                color: 'text-info',
                isView: true,
                route: '/pages/national-initiatives/initiative-details/view/',
                allowAll: true
            },
            {
                name: 'EDIT',
                icon: 'pi pi-file-edit',
                color: 'text-middle',
                isEdit: true,
                route: '/pages/national-initiatives/initiative-details/edit/',
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
        ];
    }

    navigateToEdit(row: any) {
        this.route.navigate([`/pages/national-initiatives/initiative-details/edit/${row.id}`]);
    }

    navigateToView(row: any) {
        this.route.navigate([`/pages/national-initiatives/initiative-details/view/${row.id}`]);
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
