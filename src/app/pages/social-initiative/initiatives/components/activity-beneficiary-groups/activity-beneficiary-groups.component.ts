import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions, ActivityBeneficiaryGroupsService } from '../../../../../shared';
import { PrimeAutoCompleteComponent } from '../../../../../shared/components/primeng/p-autocomplete/p-autocomplete.component';
import { AddEditActivityBeneficiaryGroupComponent } from '../add-edit-activity-beneficiary-group/add-edit-activity-beneficiary-group.component';
import { ActivitiesService } from '../../../../../shared/services/activities/activities.service';

@Component({
    selector: 'app-activity-beneficiary-groups',
    standalone: true,
    imports: [PrimeDataTableComponent, PrimeAutoCompleteComponent],
    templateUrl: './activity-beneficiary-groups.component.html',
    styleUrl: './activity-beneficiary-groups.component.scss'
})
export class ActivityBeneficiaryGroupsComponent extends BaseListComponent implements OnInit {
    @Input() activityId: string = '';
    @Input() initiativeId: string = '';

    tableOptions!: TableOptions;
    service = inject(ActivityBeneficiaryGroupsService);
    activitiesService = inject(ActivitiesService);

    selectedActivity: any = null;
    selectedActivityId: string = '';

    getActivities = (body: any) =>
        this.activitiesService.getDropDown({ ...body, filter: { ...body?.filter, initiativeId: this.initiativeId } });

    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.activityId) {
            this.selectedActivityId = this.activityId;
            this.initializeTableOptions(this.activityId);
        }
    }

    onActivitySelect(event: any) {
        const selected = event?.value;
        this.selectedActivityId = selected?.id ?? '';
        this.selectedActivity = selected ?? null;
        if (this.selectedActivityId) {
            this.initializeTableOptions(this.selectedActivityId);
        } else {
            this.tableOptions = undefined!;
        }
    }

    onActivityClear() {
        this.selectedActivityId = '';
        this.selectedActivity = null;
        this.tableOptions = undefined!;
    }

    initializeTableOptions(activityId: string) {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/activitybeneficiarygroups/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/activitybeneficiarygroups/delete'
            },
            inputCols: [
                { field: 'beneficiaryGroupName', header: 'فئة المستفيدين', filter: true, filterMode: 'text' }
            ],
            inputActions: [
                {
                    name: 'EDIT',
                    icon: 'pi pi-file-edit',
                    color: 'text-middle',
                    isCallBack: true,
                    call: (row) => this.openAddEditDialog(row),
                    allowAll: true
                },
                {
                    name: 'DELETE',
                    icon: 'pi pi-trash',
                    color: 'text-error',
                    allowAll: true,
                    isDelete: true
                }
            ],
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-ACTIVITY-BENEFICIARY-GROUPS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: { activityId }
            }
        };
    }

    openAddEditDialog(row?: any) {
        this.openDialog(
            AddEditActivityBeneficiaryGroupComponent,
            row ? 'تعديل فئة مستفيدين' : 'اضافة فئة مستفيدين',
            { id: row?.id ?? null, activityId: this.selectedActivityId }
        );
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
