import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions } from '../../../../../shared';
import { ActivityBeneficiaryGroupsService } from '../../../../../shared/services/activity-beneficiary-groups/activity-beneficiary-groups.service';
import { AddEditActivityBeneficiaryGroupComponent } from '../add-edit-activity-beneficiary-group/add-edit-activity-beneficiary-group.component';

@Component({
    selector: 'app-activity-beneficiary-groups',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './activity-beneficiary-groups.component.html',
    styleUrl: './activity-beneficiary-groups.component.scss'
})
export class ActivityBeneficiaryGroupsComponent extends BaseListComponent implements OnInit {
    tableOptions!: TableOptions;
    service = inject(ActivityBeneficiaryGroupsService);
    dialogConfig = inject(DynamicDialogConfig);

    activityId: string = '';

    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        this.activityId = this.dialogConfig.data?.activityId ?? '';
        super.ngOnInit();
        this.initializeTableOptions();
    }

    initializeTableOptions() {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/activity_beneficiarygroups/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/activity_beneficiarygroups/delete'
            },
            inputCols: [
                { field: 'nameAr', header: 'مجموعة المستفيدين', filter: true, filterMode: 'text' }
            ],
            inputActions: [
                {
                    name: 'EDIT',
                    icon: 'pi pi-pencil',
                    color: 'text-warning',
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
                filter: { activityId: this.activityId }
            }
        };
    }

    openAddEditDialog(row?: any) {
        this.openDialog(
            AddEditActivityBeneficiaryGroupComponent,
            row ? 'تعديل مجموعة المستفيدين' : 'اضافة مجموعة المستفيدين',
            { id: row?.id ?? null, activityId: this.activityId }
        );
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
