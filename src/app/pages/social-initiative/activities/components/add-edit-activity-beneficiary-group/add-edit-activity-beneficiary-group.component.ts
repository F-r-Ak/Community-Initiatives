import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeAutoCompleteComponent, SubmitButtonsComponent, ActivityBeneficiaryGroupsService, BeneficiaryGroupsService } from '../../../../../shared';

@Component({
    selector: 'app-add-edit-activity-beneficiary-group',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeAutoCompleteComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-activity-beneficiary-group.component.html',
    styleUrl: './add-edit-activity-beneficiary-group.component.scss'
})
export class AddEditActivityBeneficiaryGroupComponent extends BaseEditComponent implements OnInit {
    activityBeneficiaryGroupsService = inject(ActivityBeneficiaryGroupsService);
    beneficiaryGroupsService = inject(BeneficiaryGroupsService);
    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);

    selectedGroups: any[] = [];
    activityId: string = '';

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data;
        this.activityId = data?.activityId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';

        if (this.pageType === 'edit' && this.id) {
            this.getEditRecord();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [null],
            activityId: [this.activityId, Validators.required],
            beneficiaryGroupId: [[], Validators.required]
        });
    }

    getEditRecord() {
        this.activityBeneficiaryGroupsService.getEditActivityBeneficiaryGroup(this.id).subscribe((data: any) => {
            this.initFormGroup();
            this.form.patchValue({ ...data, beneficiaryGroupId: data.beneficiaryGroupId ?? [] });
        });
    }

    onGroupsSelect(selected: any[]) {
        this.selectedGroups = selected ?? [];
        this.form.get('beneficiaryGroupId')?.setValue(this.selectedGroups.map((g: any) => g.id));
    }

    submit() {
        if (this.form.invalid) return;

        if (this.pageType === 'add') {
            this.activityBeneficiaryGroupsService.add(this.form.value).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.activityBeneficiaryGroupsService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect() {
        this.dialogRef.close(false);
    }
}
