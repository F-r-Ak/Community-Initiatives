import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, TableOptions } from '../../../../../shared';
import { AuthHelper } from '../../../../../core';
import { AddEditInitiativeComponent } from '../../components/add-edit-initiative/add-edit-initiative.component';
import { InitiativeDefinitionComponent } from '../../components/initiative-definition/initiative-definition.component';
import { DevelpmentInitiativesService } from '../../../../../shared/services/develpment-initiatives/develpment-initiatives.service';
@Component({
    selector: 'app-initiatives-definitions',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './initiatives-definitions.component.html',
    styleUrl: './initiatives-definitions.component.scss'
})
export class InitiativesDefinitionsComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(DevelpmentInitiativesService);
    authHelper = inject(AuthHelper);
    formBuilder: FormBuilder = inject(FormBuilder);
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
                getAll: 'v1/developmentinitiative/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/developmentinitiative/deletesoft'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'DEVELOPMENT-INITIATIVES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['name', 'fieldName', 'initiativeStartDate', 'initiativeEndDate', 'initiativeCategory']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            {
                field: 'name',
                header: 'اسم المبادرة',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'initiativeCategoryNameAr',
                header: 'فئة المبادرة',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'fieldName',
                header: 'المجال',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'initiativeStartDate',
                header: 'تاريخ بداية المبادرة',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'initiativeEndDate',
                header: 'تاريخ نهاية المبادرة',
                filter: true,
                filterMode: 'text'
            }
        ];
    }

    initializeTableActions(): TableOptions['inputActions'] {
        return [
            {
                name: 'VIEW',
                icon: 'pi pi-eye',
                color: 'text-info',
                isCallBack: true,
                call: (row) => {
                    this.openView(row);
                },
                allowAll: true
            },
            {
                name: 'EDIT',
                icon: 'pi pi-file-edit',
                color: 'text-middle',
                isCallBack: true,
                call: (row) => {
                    this.openEdit(row);
                },
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
        ];
    }

    openAdd() {
        this.openDialog(AddEditInitiativeComponent, 'اضافة مبادرة ', {
            pageType: 'add'
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditInitiativeComponent, 'تعديل مبادرة', {
            pageType: 'edit',
            row: { rowData }
        });
    }

    openView(rowData: any) {
        this.openDialog(InitiativeDefinitionComponent, 'عرض مبادرة', {
            pageType: 'view',
            row: { rowData }
        });
    }

    /* when leaving the component */
    override ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
