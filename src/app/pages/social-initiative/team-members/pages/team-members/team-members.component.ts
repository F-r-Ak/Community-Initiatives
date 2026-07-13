import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, TeamMembersService, TableOptions } from '../../../../../shared';
import { AddEditTeamMemberComponent } from '../../components/add-edit-team-member/add-edit-team-member.component';
import { TeamMemberComponent } from '../../components/team-member/team-member.component';
import { AuthHelper } from '../../../../../core';
@Component({
    selector: 'app-team-members',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './team-members.component.html',
    styleUrl: './team-members.component.scss'
})
export class TeamMembersComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(TeamMembersService);
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
                getAll: 'v1/teammembers/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/teammembers/deletesoft'
            },
            inputCols: this.initializeTableColumns(),
            inputActions: this.initializeTableActions(),
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-SETTINGS-TEAM-MEMBERS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {
                    createdById: this.authHelper.hasRole('User') ? this.authHelper.getUserId() : null,
                }
            },
            responsiveDisplayedProperties: ['nameAr', 'mobile', 'jobStatusName.nameAr', 'teamCategoryName.nameAr']
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
                field: 'mobile',
                header: 'رقم الجوال',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'email',
                header: 'البريد الإلكتروني',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'specailization',
                header: 'التخصص',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'jobStatusName.nameAr',
                header: 'الحالة الوظيفية',
                filter: true,
                filterMode: 'text'
            },
            {
                field: 'teamCategoryName.nameAr',
                header: 'نوع العضوية',
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
        this.openDialog(AddEditTeamMemberComponent, 'اضافة عضو فريق ', {
            pageType: 'add'
        });
    }

    openView(rowData: any) {
        this.openDialog(TeamMemberComponent, 'عرض عضو فريق', {
            pageType: 'view',
            row: { rowData }
        });
    }

    openEdit(rowData: any) {
        this.openDialog(AddEditTeamMemberComponent, 'تعديل عضو فريق ', {
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
