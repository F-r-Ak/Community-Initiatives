import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions, PrimeTitleToolBarComponent } from '../../../../../shared';
import { ActivitiesService } from '../../../../../shared/services/activities/activities.service';
import { RoleCodes } from '../../../../../core/enums/role';
import { AuthHelper } from '../../../../../core';

@Component({
    selector: 'app-activities',
    standalone: true,
    imports: [RouterModule,PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './activities.component.html',
    styleUrl: './activities.component.scss'
})
export class ActivitiesComponent extends BaseListComponent implements OnInit {
    authHelper = inject(AuthHelper);
    tableOptions!: TableOptions;
    service = inject(ActivitiesService);
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
                getAll: 'v1/activities/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/activities/delete'
            },
            inputCols: [
                { field: 'initiativeName', header: 'اسم المبادرة', filter: true, filterMode: 'text' },
                { field: 'name', header: 'اسم النشاط', filter: true, filterMode: 'text' },
                { field: 'cityName', header: 'المدينة', filter: true, filterMode: 'text' },
                { field: 'activityTypeName', header: 'نوع النشاط', filter: true, filterMode: 'text' },
                { field: 'startDate', header: 'تاريخ البدء', filter: true, filterMode: 'date' },
                { field: 'endDate', header: 'تاريخ الانتهاء', filter: true, filterMode: 'date' }
            ],
            inputActions: [
                {
                    name: 'VIEW',
                    icon: 'pi pi-eye',
                    color: 'text-info',
                    isView: true,
                    route: '/pages/social-initiatives/activities/view/',
                    allowAll: true
                },
                {
                    name: 'EDIT',
                    icon: 'pi pi-file-edit',
                    color: 'text-middle',
                    isEdit: true,
                    route: '/pages/social-initiatives/activities/edit/',
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
                filter: this.authHelper.hasRole(this.rolesEnum.Employee) ? { createdById: this.authHelper.getUserId() } : {}
            }
        };
    }

    openActivityBeneficiaryGroups(row?: any) {
        this.route.navigate([`pages/social-initiatives/activities/beneficiary-groups/${row?.id}`]);
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
