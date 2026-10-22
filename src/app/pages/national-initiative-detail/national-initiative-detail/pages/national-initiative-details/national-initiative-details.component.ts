import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, TableOptions } from '../../../../../shared';
import { DevelopmentServiceService } from '../../../../../shared';
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
    service = inject(DevelopmentServiceService);
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
                filter: this.authHelper.hasRole(this.rolesEnum.Employee)
                    ? { createdById: this.authHelper.getUserId() }
                    : {}
            },
            responsiveDisplayedProperties: ['name', 'fieldName', 'cityName', 'initiativeMangerName', 'createdDate']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            { field: 'name', header: 'اسم الخدمة', filter: true, filterMode: 'text' },
          
           
            { field: 'cityName', header: 'المركز', filter: true, filterMode: 'text' },
             { field: 'totalBeneficiaryNumber', header: 'عدد المستفيدين', filter: true, filterMode: 'text' },
             { field: 'serviceStartDate', header: 'تاريخ بدء الخدمة', filter: true, filterMode: 'date' },
            { field: 'serviceEndDate', header: 'تاريخ انتهاء الخدمة', filter: true, filterMode: 'date' },
          

        ];
    }

    initializeTableActions(): TableOptions['inputActions'] {
        return [
            {
                name: 'VIEW',
                icon: 'pi pi-eye',
                color: 'text-info',
                isView: true,
                route: '/pages/national-initiative-detail/national-initiative-detail/view/',
                allowAll: true
            },
            {
                name: 'EDIT',
                icon: 'pi pi-file-edit',
                color: 'text-middle',
                isEdit: true,
                route: '/pages/national-initiative-detail/national-initiative-detail/edit/',
                allowAll: true
            },
           this.authHelper.isAdmin ?
                {
                    name: 'DELETE',
                    icon: 'pi pi-trash',
                    color: 'text-error',
                    allowAll: true,
                    isDelete: true
                } : {}
        ];
    }

    navigateToEdit(row: any) {
        this.route.navigate([`/pages/national-initiative-detail/national-initiative-detail/edit/${row.id}`]);
    }

    navigateToView(row: any) {
        this.route.navigate([`/pages/national-initiative-detail/national-initiative-detail/view/${row.id}`]);
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
