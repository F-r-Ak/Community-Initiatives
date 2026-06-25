import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeAutoCompleteComponent } from '../../../../../shared/components/primeng/p-autocomplete/p-autocomplete.component';
import { SubmitButtonsComponent } from '../../../../../shared/components/submit-buttons/submit-buttons.component';
import { ActivityBeneficiaryGroupsService } from '../../../../../shared/services/activity-beneficiary-groups/activity-beneficiary-groups.service';
import { BeneficiaryGroupsService } from '../../../../../shared/services/settings/beneficiary-groups/beneficiary-groups.service';

@Component({
    selector: 'app-add-edit-activity-beneficiary-group',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeAutoCompleteComponent,
        SubmitButtonsComponent
    ],
    templateUrl: './add-edit-activity-beneficiary-group.component.html',
    styleUrl: './add-edit-activity-beneficiary-group.component.scss'
})
export class AddEditActivityBeneficiaryGroupComponent extends BaseEditComponent implements OnInit {
    activityBeneficiaryGroupsService = inject(ActivityBeneficiaryGroupsService);
    beneficiaryGroupsService = inject(BeneficiaryGroupsService);
    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);

    getBeneficiaryGroups = this.beneficiaryGroupsService.getDropDown.bind(this.beneficiaryGroupsService);

    selectedBeneficiaryGroups: any[] = [];
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
            this.form.patchValue(data);
            if (data.beneficiaryGroupId?.length) {
                this.selectedBeneficiaryGroups = data.beneficiaryGroups ?? [];
            }
        });
    }

    onBeneficiaryGroupsSelect(event: any) {
        this.selectedBeneficiaryGroups = event.value ?? [];
        const ids = this.selectedBeneficiaryGroups.map((g: any) => g.id);
        this.form.get('beneficiaryGroupId')?.setValue(ids);
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
