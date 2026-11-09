import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions, NationalInitiativesService, EnumsGenService } from '../../../../../shared';
import { AddEditNationalEntityComponent } from '../add-edit-national-entity/add-edit-national-entity.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-national-entities',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './national-entities.component.html',
  styleUrl: './national-entities.component.scss'
})
export class NationalEntitiesComponent extends BaseListComponent implements OnInit {
    @Input() nationalInitiativeDetailId: string = '';
    @Output() totalCountChange = new EventEmitter<number>();

    authHelper = inject(AuthHelper);
    service = inject(NationalInitiativesService);
    enumsGenService = inject(EnumsGenService);

    get rolesEnum() {
        return RoleCodes;
    }

    tableOptions!: TableOptions;

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
                getAll: 'v1/nationalentities/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/nationalentities/delete'
            },
            inputCols: [
                { field: 'entityName', header: 'الجهة', filter: true, filterMode: 'text', renderFn: (row: any) => row.entityName || row.vw_OrganizationName },
                {
                    field: 'entityTypeNameAr',
                    header: 'نوع الجهة',
                    filter: true,
                    filterMode: 'enum',
                    filterColumnName: 'entityType',
                    filterOptions$: this.enumsGenService.EntityTypes$
                },
                { field: 'description', header: 'الوصف', filter: true, filterMode: 'text' }
            ],
            inputActions: [
                {
                    name: 'VIEW',
                    icon: 'pi pi-eye',
                    color: 'text-info',
                    isCallBack: true,
                    call: (row: any) => this.navigateToView(row),
                    allowAll: true
                },
                // {
                //     name: 'EDIT',
                //     icon: 'pi pi-file-edit',
                //     color: 'text-middle',
                //     isCallBack: true,
                //     call: (row: any) => this.openAddEditDialog(row),
                //     allowAll: true
                // },
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
                componentName: 'COMMUNITY-INITIATIVES-NATIONAL-INITIATIVES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: { nationalInitiativeDetailId: this.nationalInitiativeDetailId }
            }
        };
    }

    openAddEditDialog(row?: any) {
        this.openDialog(
            AddEditNationalEntityComponent,
            row ? 'تعديل جهة منفذة' : 'إضافة جهة منفذة',
            { id: row?.id ?? null, nationalInitiativeDetailId: this.nationalInitiativeDetailId, rowData: row }
        );
    }

    navigateToView(row: any): void {
        this.route.navigate([`/pages/national-initiatives/initiative-details/view-entity/${row.id}`]);
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
