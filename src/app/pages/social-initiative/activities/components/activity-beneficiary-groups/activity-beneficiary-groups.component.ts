import { Component, OnInit, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions, ActivityBeneficiaryGroupsService, PrimeTitleToolBarComponent } from '../../../../../shared';
import { AddEditActivityBeneficiaryGroupComponent } from '../add-edit-activity-beneficiary-group/add-edit-activity-beneficiary-group.component';
import { ActivityBeneficiaryGroupComponent } from '../activity-beneficiary-group/activity-beneficiary-group.component';
import { RoleCodes } from '../../../../../core/enums/role';
import { AuthHelper } from '../../../../../core';

@Component({
    selector: 'app-activity-beneficiary-groups',
    standalone: true,
    imports: [PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './activity-beneficiary-groups.component.html',
    styleUrl: './activity-beneficiary-groups.component.scss'
})
export class ActivityBeneficiaryGroupsComponent extends BaseListComponent implements OnInit, OnChanges {
    tableOptions!: TableOptions;
    service = inject(ActivityBeneficiaryGroupsService);
    authHelper = inject(AuthHelper);

    get rolesEnum() {
        return RoleCodes;
    }

    /** Allow activityId to be passed as an input when embedded in a tab */
    @Input() activityIdInput: string | null = null;
    @Input() override pageTitle: string = 'مجموعة المستفيدين';
    activityId: string = '';

    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        this.activityId = this.activityIdInput ?? this.activatedRoute.snapshot.params['activityId'] ?? '';
        super.ngOnInit();
        // Always use the @Input value (default 'مجموعة المستفيدين') instead of whatever
        // super.ngOnInit() pulled from the route data, since this component has its own title.
        this.pageTitle = 'مجموعة المستفيدين';
        this.initializeTableOptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['activityIdInput'] && !changes['activityIdInput'].firstChange) {
            this.activityId = this.activityIdInput ?? '';
            this.initializeTableOptions();
        }
    }

    initializeTableOptions() {

        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/activity_beneficiarygroups/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/activity_beneficiarygroups/delete'
            },
            inputCols: [
                { field: 'initiativeName', header: 'اسم المباردة', filter: true, filterMode: 'text' },
                { field: 'activityName', header: 'اسم النشاط', filter: true, filterMode: 'text' },
                { field: 'beneficiaryGroupName', header: 'المستفيد', filter: true, filterMode: 'text' },
                { field: 'activityTypeName', header: 'نوع النشاط', filter: true, filterMode: 'text' }
            ],
            inputActions: [
                {
                    name: 'VIEW',
                    icon: 'pi pi-eye',
                    color: 'text-info',
                    isCallBack: true,
                    call: (row: any) => this.openViewDialog(row),
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
            ],


            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-ACTIVITY-BENEFICIARY-GROUPS',
                allowAll: true,
                listOfPermissions: []
            },

            bodyOptions: {
                filter: this.authHelper.hasRole(this.rolesEnum.Employee)
                    ? { createdById: this.authHelper.getUserId(), activityId: this.activityId }
                    : { activityId: this.activityId }
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

    openViewDialog(rowData: any) {
        this.openDialog(
            ActivityBeneficiaryGroupComponent,
            'عرض مجموعة المستفيدين',
            { pageType: 'view', row: { rowData } },
            { closable: true }
        );
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
