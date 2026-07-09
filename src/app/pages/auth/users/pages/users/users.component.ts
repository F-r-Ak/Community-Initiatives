import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { TableOptions } from '../../../../../shared/interfaces';
import { AccountService } from '../../../../../shared';
import { PrimeDataTableComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent, PrimeTitleToolBarComponent } from '../../../../../shared';
import { AddEditUserComponent } from '../../components/add-edit-user/add-edit-user.component';
import { AuthHelper } from '../../../../../core';
@Component({
    selector: 'app-users',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(AccountService);
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
                getAll: 'v1/accounts/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/accounts/delete'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'CITIZEN-SERVICES-LOOKUPS-ACCIDENT-TYPES',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['email']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {

        return [
              {
                field: 'userName',
                header: 'اسم المستخدم',
                filter: true,
                filterMode: 'text'
            },
             {
                field: 'email',
                header: 'البريد اللالكتروني',
                filter: true,
                filterMode: 'text'
            },
            // {
            //     field: 'organization',
            //     header: 'الجهة',
            //     filter: true,
            //     filterMode: 'text'
            // }
        ];
    }

    initializeTableActions(): TableOptions['inputActions'] {
        return [
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
            this.authHelper.isAdmin?
            {
                name: 'DELETE',
                icon: 'pi pi-trash',
                color: 'text-error',
                allowAll: true,
                isDelete: true
            }:{  }:{  }
        ];
    }

    openAdd() {
        this.openDialog(AddEditUserComponent, 'اضافة مستخدم', {
            pageType: 'add'
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditUserComponent, 'تعديل  مستخدم', {
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
