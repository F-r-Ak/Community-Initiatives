import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, AgeGroupsService, TableOptions, ServiceTypeDetailsService } from '../../../../../shared';
import { AddEditServiceTypeDetailComponent } from '../../components/add-edit-service-type-detail/add-edit-service-type-detail.component';
import { ServiceTypeDetailComponent } from '../../components/service-type-detail/service-type-detail.component';
import { AuthHelper } from '../../../../../core';
@Component({
    selector: 'app-service-type-details',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './service-type-details.component.html',
    styleUrl: './service-type-details.component.scss'
})
export class ServiceTypeDetailsComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(ServiceTypeDetailsService);
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
                getAll: 'v1/servicetypedetails/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/servicetypedetails/deletesoft'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-SETTINGS-SERVICE-TYPE-DETAILS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['nameAr']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            {
                field: 'nameAr',
                header: ' اسم تفاصيل الخدمه',
                filter: true,
                filterMode: 'text'
            },
            {


                field: 'serviceName',
                header: ' اسم الخدمه',
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
        this.openDialog(AddEditServiceTypeDetailComponent, 'اضافة  تفاصيل  الخدمة ', {
            pageType: 'add'
        });
    }

    openView(rowData: any) {
        this.openDialog(ServiceTypeDetailComponent, 'عرض  تفاصيل  الخدمة', {
            pageType: 'view',
            row: { rowData }
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditServiceTypeDetailComponent, 'تعديل  تفاصيل  الخدمة ', {
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
