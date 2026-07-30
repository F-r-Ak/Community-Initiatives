import { Component, OnInit, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions, ActivityEntitiesService, PrimeTitleToolBarComponent } from '../../../../../shared';
import { AddEditActivityEntityComponent } from '../add-edit-activity-entity/add-edit-activity-entity.component';
import { ActivityEntityComponent } from '../activity-entity/activity-entity.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-activity-entities',
    standalone: true,
    imports: [PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './activity-entities.component.html',
    styleUrl: './activity-entities.component.scss'
})
export class ActivityEntitiesComponent extends BaseListComponent implements OnInit, OnChanges {
    tableOptions!: TableOptions;
    service = inject(ActivityEntitiesService);
    authHelper = inject(AuthHelper);

    get rolesEnum() {
        return RoleCodes;
    }

    @Input() activityIdInput: string | null = null;
    @Input() override pageTitle: string = 'جهات التنسيق';
    activityId: string = '';

    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
      this.activityId = this.activityIdInput ?? this.activatedRoute.snapshot.params['activityId'] ?? '';
        super.ngOnInit();
        this.pageTitle = 'جهات التنسيق';
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
                getAll: 'v1/activity_entities/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/activity_entities/delete'
            },
            inputCols: [
                { field: 'name', header: 'الجهة', filter: true, filterMode: 'text' },
                { field: 'entityTypeName.nameAr', header: 'نوع الجهة', filter: true, filterMode: 'text' },
                { field: 'activityName', header: 'النشاط', filter: true, filterMode: 'text' }
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
                this.authHelper.isAdmin
                    ? { name: 'DELETE', icon: 'pi pi-trash', color: 'text-error', allowAll: true, isDelete: true }
                    : {}
            ],
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-ACTIVITY-ENTITIES',
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
            AddEditActivityEntityComponent,
            row ? 'تعديل جهة التنسيق' : 'اضافة جهة التنسيق',
            { id: row?.id ?? null, activityId: this.activityId }
        );
    }

    openViewDialog(rowData: any) {
        this.openDialog(
            ActivityEntityComponent,
            'عرض جهة التنسيق',
            { pageType: 'view', row: { rowData } },
            { closable: true }
        );
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}

