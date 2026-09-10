import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions } from '../../../../../shared';
import { ServiceDevelopmentEntitiesService } from '../../../../../shared/services/service-developmentEntity/service-developmentEntity.service';
import { AddEditServiceDevelopmentEntityComponent } from '../add-edit-service-developmentEntity/add-edit-service-developmentEntity.component';
import { ServiceDevelopmentEntityComponent } from '../service-developmentEntity/service-developmentEntity.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-service-developmentEntities',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './service-developmentEntities.component.html',
    styleUrl: './service-developmentEntities.component.scss'
})
export class ServiceDevelopmentEntitiesComponent extends BaseListComponent implements OnInit {
    @Input() developmentServiceId: string = '';

    tableOptions!: TableOptions;
    authHelper = inject(AuthHelper);
    service = inject(ServiceDevelopmentEntitiesService);
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
                getAll: 'v1/service_developmententity/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/service_developmententity/delete'
            },
            inputCols: [
                { field: 'teamMemberName', header: 'اسم العضو', filter: true, filterMode: 'text' }
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
                this.authHelper.isAdmin?
                {
                    name: 'DELETE',
                    icon: 'pi pi-trash',
                    color: 'text-error',
                    allowAll: true,
                    isDelete: true
                }: {}
            ],
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-INITIATIVE-TEAMS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {

                filter: this.authHelper.hasRole(this.rolesEnum.Employee)
                    ? { createdById: this.authHelper.getUserId(), developmentServiceId: this.developmentServiceId }
                    : { developmentServiceId: this.developmentServiceId }
            }
        };
    }

    openAddEditDialog(row?: any) {
        this.openDialog(
            AddEditServiceDevelopmentEntityComponent,
            row ? 'تعديل جهة تطوير' : 'اضافة جهة تطوير',
            { id: row?.id ?? null, developmentServiceId: this.developmentServiceId }
        );
    }

    openViewDialog(rowData: any) {
        this.openDialog(
            ServiceDevelopmentEntityComponent,
            'عرض جهة تطوير',
            { pageType: 'view', row: { rowData } },
            { closable: true }
        );
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
