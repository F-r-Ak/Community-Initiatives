import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent,SupportDetailsService , TableOptions } from '../../../../../shared';
import { AddEditSupportDetailComponent } from '../../components/add-edit-support-detail/add-edit-support-detail.component';
import { SupportDetailComponent } from '../../components/support-detail/support-detail.component';
import { AuthHelper } from '../../../../../core';
@Component({
    selector: 'app-support-details',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './support-details.component.html',
    styleUrl: './support-details.component.scss'
})
export class SupportDetailsComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(SupportDetailsService);
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
                getAll: 'v1/supportdetails/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/supportdetails/deletesoft'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-SETTINGS-SUPPORT-DETAILS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['nameAr','cityName']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            {
                field: 'nameAr',
                header: 'الاسم',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'support.nameAr',
                header: 'نوع الدعم',
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
        this.openDialog(AddEditSupportDetailComponent, 'اضافة تفاصيل دعم ', {
            pageType: 'add'
        });
    }

    openView(rowData: any) {
        this.openDialog(SupportDetailComponent, 'عرض تفاصيل الدعم', {
            pageType: 'view',
            row: { rowData }
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditSupportDetailComponent, 'تعديل تفاصيل الدعم ', {
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
