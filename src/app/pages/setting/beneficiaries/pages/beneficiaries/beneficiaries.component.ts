import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, BeneficiariesService, TableOptions } from '../../../../../shared';
import { AddEditBeneficiaryComponent } from '../../components/add-edit-beneficiary/add-edit-beneficiary.component';
import { BeneficiaryComponent } from '../../components/beneficiary/beneficiary.component';
import { AuthHelper } from '../../../../../core';
@Component({
    selector: 'app-beneficiaries',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './beneficiaries.component.html',
    styleUrl: './beneficiaries.component.scss'
})
export class BeneficiariesComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(BeneficiariesService);
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
                getAll: 'v1/beneficiaries/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/beneficiaries/deletesoft'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-SETTINGS-BENEFICIARIES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['nameAr','address','mobile'],
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
                field: 'address',
                header: 'العنوان',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'mobile',
                header: 'الهاتف',
                filter: true,
                filterMode: 'text'
            },
                
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
        this.openDialog(AddEditBeneficiaryComponent, 'اضافة مستفيد ', {
            pageType: 'add'
        });
    }

    openView(rowData: any) {
        this.openDialog(BeneficiaryComponent, 'عرض المستفيد', {
            pageType: 'view',
            row: { rowData }
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditBeneficiaryComponent, 'تعديل مستفيد ', {
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
