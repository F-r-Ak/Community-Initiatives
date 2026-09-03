import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, DevelopmentEntitiesService, TableOptions } from '../../../../../shared';
import { AddEditDevelopmentEntityComponent } from '../../components/add-edit-development-entity/add-edit-development-entity.component';
    
import { DevelopmentEntityComponent } from '../../components/development-entity/development-entity.component';
import { AuthHelper } from '../../../../../core';
@Component({
    selector: 'app-development-entities',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './development-entities.component.html',
    styleUrl: './development-entities.component.scss'
})
export class DevelopmentEntitiesComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(DevelopmentEntitiesService);
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
                getAll: 'v1/developmententity/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/developmententity/deletesoft'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-SETTINGS-DEVELOPMENT-ENTITIES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['nameAr','developmentEntityType'],
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            {
                field: 'nameAr',
                header: 'المركز',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'developmentEntityTypeName.nameAr',
                header: 'نوع الجهه',
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
           this.authHelper.isAdmin?
            {
                name: 'DELETE',
                icon: 'pi pi-trash',
                color: 'text-error',
                allowAll: true,
                isDelete: true
            }:{  }
        ];
    }

    openAdd() {
        this.openDialog(AddEditDevelopmentEntityComponent, 'اضافة الجهات التنموية ', {
            pageType: 'add'
        });
    }

    openView(rowData: any) {
        this.openDialog(DevelopmentEntityComponent, 'عرض الجهات التنموية', {
            pageType: 'view',
            row: { rowData }
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditDevelopmentEntityComponent, 'تعديل الجهات التنموية', {
            pageType: 'edit',
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
