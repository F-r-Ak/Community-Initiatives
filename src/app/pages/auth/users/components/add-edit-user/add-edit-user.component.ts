import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, AccountService, PrimeAutoCompleteComponent, EmployeeService, RolesService, PrimeCheckBoxComponent } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { TabsModule } from 'primeng/tabs';
import { UserTabs } from '../../../../../core/enums/user-tabs';

@Component({
    selector: 'app-add-edit-user',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeAutoCompleteComponent, TabsModule, PrimeInputTextComponent,PrimeCheckBoxComponent],
    templateUrl: './add-edit-user.component.html',
    styleUrl: './add-edit-user.component.scss'
})
export class AddEditUserComponent extends BaseEditComponent implements OnInit {
    accountService: AccountService = inject(AccountService);
    employeeService = inject(EmployeeService);
    dialogService: DialogService = inject(DialogService);
    selectedEmployee: any;
    filteredEmployees: any[] = [];
    selectedOrganization: any;
    filteredOrganizations: any[] = [];
    organizationId: any;
    userId: any;
    selectedRole: any;
    filteredRoles: any[] = [];
    rolesService = inject(RolesService);

    private passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
        const newPassword = control.get('newPassword');
        const confirmPassword = control.get('confirmPassword');

        if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
            confirmPassword.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        // Clear error if passwords match
        if (confirmPassword?.errors?.['passwordMismatch']) {
            confirmPassword.setErrors(null);
        }
        return null;
    };


    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.pageType === 'edit') {
            this.getEditUser();
            this.userId = this.activatedRoute.snapshot.paramMap.get('id') as string;
            console.log('User ID for edit:', this.userId);
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group(
            {
                id: [],
                userName: [],
                password: [],
                email: [],
                employeeId: [],
                oldPassword: [''],
                newPassword: [''],
                confirmPassword: [''],
                roleId:[null],
                isAdmin:[false]
            },
            { validators: this.passwordMatchValidator }
        );

        // Only require these fields in edit mode
        if (this.pageType === 'edit') {
            this.form.get('oldPassword')?.setValidators([Validators.required]);
            this.form.get('newPassword')?.setValidators([Validators.required]);
            this.form.get('confirmPassword')?.setValidators([Validators.required]);
        }
    }


    getRoles(event: any) {
        const query = event.query.toLowerCase();
        this.rolesService.roles.subscribe({
            next: (res) => {
                this.filteredRoles = res.filter((role: any) => role.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب الصلاحيات');
            }
        });
    }

    onRoleSelect(event: any) {
        this.selectedRole = event.value;
        this.form.get('roleId')?.setValue(this.selectedRole?.id);

    }

 fetchRoleDetails(user: any) {
    const selecuser=user.roles.id
        this.rolesService.roles.subscribe((response: any) => {
            this.filteredRoles = Array.isArray(response) ? response : response.data || [];
            console.log("ddddddd",  this.filteredRoles)
            this.selectedRole = this.filteredRoles.find((item: any) => item.id === selecuser);
        });
    }
//    fetchRoleDetails(roleId: any) {
//     this.rolesService.roles.subscribe((response: any) => {
//         this.filteredRoles = Array.isArray(response) ? response : response.data || [];
//         this.selectedRole = this.filteredRoles.find((role: any) => role.id === roleId);
//         // Set the selected role in the form
//         if (this.selectedRole) {
//             this.form.get('roleId')?.setValue(this.selectedRole.id);
//         }
//     });
// }

    getEditUser = () => {
        this.accountService.getEditUser(this.id).subscribe((user: any) => {
            this.initFormGroup();
            this.form.patchValue(user);
           
    
            this.fetchRoleDetails(user);
        }

        );}
   


   
    get userEnum() {
        return UserTabs;
    }

    submit() {
        if (this.pageType === 'add')
            this.accountService.register(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.accountService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.closeDialog();
            });
    }


    override redirect = () => {
        if (this.dialogService.dialogComponentRefMap.size > 0) {
            this.closeDialog();
        }
    };

    closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
