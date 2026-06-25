import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions } from '../../../../../shared';
import { ActivitiesService } from '../../../../../shared/services/activities/activities.service';
import { ActivityBeneficiaryGroupsComponent } from '../../components/activity-beneficiary-groups/activity-beneficiary-groups.component';

@Component({
    selector: 'app-activities',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './activities.component.html',
    styleUrl: './activities.component.scss'
})
export class ActivitiesComponent extends BaseListComponent implements OnInit {

    tableOptions!: TableOptions;
    service = inject(ActivitiesService);

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
                    name: 'مجموعات المستفيدين',
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
                filter: {  }
            }
        };
    }

    openActivityBeneficiaryGroups(row?: any) {
        this.openDialog(
            ActivityBeneficiaryGroupsComponent,
            'فئة المستفيدين',
            { activityId: row?.id ?? null }
        );
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
