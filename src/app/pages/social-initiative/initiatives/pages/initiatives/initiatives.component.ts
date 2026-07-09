import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, TableOptions } from '../../../../../shared';
import { InitiativesService } from '../../../../../shared/services/initiatives/initiatives.service';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-initiatives',
    imports: [RouterModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './initiatives.component.html',
    styleUrl: './initiatives.component.scss'
})
export class InitiativesComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    authHelper = inject(AuthHelper);
    service = inject(InitiativesService);
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
                getAll: 'v1/initiatives/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/initiatives/delete'
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
            { field: 'name', header: 'اسم المبادرة', filter: true, filterMode: 'text' },
            { field: 'fieldName', header: 'المجال', filter: true, filterMode: 'text' },
            { field: 'cityName', header: 'المركز', filter: true, filterMode: 'text' },
            { field: 'initiativeMangerName', header: 'المسئول', filter: true, filterMode: 'text' }
        ];
    }

    initializeTableActions(): TableOptions['inputActions'] {
        return [
            {
                name: 'VIEW',
                icon: 'pi pi-eye',
                color: 'text-info',
                isView: true,
                route: '/pages/social-initiatives/initiatives/view/',
                allowAll: true
            },
            {
                name: 'EDIT',
                icon: 'pi pi-file-edit',
                color: 'text-middle',
                isEdit: true,
                route: '/pages/social-initiatives/initiatives/edit/',
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
        this.route.navigate([`social-initiatives/initiatives/edit/${row.id}`]);
    }

    navigateToView(row: any) {
        this.route.navigate([`social-initiatives/initiatives/view/${row.id}`]);
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
