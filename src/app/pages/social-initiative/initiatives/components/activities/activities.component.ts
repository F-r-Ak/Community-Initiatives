import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions } from '../../../../../shared';
import { ActivitiesService } from '../../../../../shared/services/activities/activities.service';
import { AddEditActivityComponent } from '../add-edit-activity/add-edit-activity.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-activities',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './activities.component.html',
    styleUrl: './activities.component.scss'
})
export class ActivitiesComponent extends BaseListComponent implements OnInit {
    @Input() initiativeId: string = '';
    @Output() totalCountChange = new EventEmitter<number>();
    authHelper = inject(AuthHelper);
     get rolesEnum() {
                return RoleCodes;
            }
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
                    name: 'EDIT',
                    icon: 'pi pi-file-edit',
                    color: 'text-middle',
                    isCallBack: true,
                    call: (row) => this.openAddEditDialog(row),
                    allowAll: true
                },
                this.authHelper.isAdmin ?
                {
                    name: 'DELETE',
                    icon: 'pi pi-trash',
                    color: 'text-error',
                    allowAll: true,
                    isDelete: true
                }: {}
            ],
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-ACTIVITIES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: this.authHelper.hasRole(this.rolesEnum.Employee)
                    ? { createdById: this.authHelper.getUserId(),initiativeId: this.initiativeId  }
                    : {initiativeId: this.initiativeId }  
            }
        };
    }

    openAddEditDialog(row?: any) {
        this.openDialog(
            AddEditActivityComponent,
            row ? 'تعديل نشاط' : 'اضافة نشاط',
            { id: row?.id ?? null, initiativeId: this.initiativeId }
        );
    }

    override loadDataFromServer(): void {
        this.dataTableService.loadData(this.tableOptions.inputUrl.getAll).subscribe({
            next: (res) => {
                this.data = res.data;
                this.totalCount = res.totalCount;
                this.totalCountChange.emit(this.totalCount);
            }
        });
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
