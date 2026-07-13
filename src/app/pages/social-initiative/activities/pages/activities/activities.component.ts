import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions, PrimeTitleToolBarComponent } from '../../../../../shared';
import { ActivitiesService } from '../../../../../shared/services/activities/activities.service';
import { RoleCodes } from '../../../../../core/enums/role';
import { AuthHelper } from '../../../../../core';

@Component({
    selector: 'app-activities',
    standalone: true,
    imports: [PrimeDataTableComponent, PrimeTitleToolBarComponent],
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
                { field: 'name', header: 'اسم النشاط', filter: true, filterMode: 'text' },
                { field: 'cityName', header: 'المدينة', filter: true, filterMode: 'text' },
                { field: 'activityTypeName', header: 'نوع النشاط', filter: true, filterMode: 'text' },
                { field: 'startDate', header: 'تاريخ البدء', filter: true, filterMode: 'date' },
                { field: 'endDate', header: 'تاريخ الانتهاء', filter: true, filterMode: 'date' }
            ],
            inputActions: [
                {
                    name: 'مجموعة المستفيدين',
                    icon: 'pi pi-users',
                    color: 'text-middle',
                    isCallBack: true,
                    call: (row) => this.openActivityBeneficiaryGroups(row),
                    allowAll: true
                }
            ],
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-ACTIVITIES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: this.authHelper.hasRole(this.rolesEnum.Employee)
                    ? { createdById: this.authHelper.getUserId() }
                    : {}
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
