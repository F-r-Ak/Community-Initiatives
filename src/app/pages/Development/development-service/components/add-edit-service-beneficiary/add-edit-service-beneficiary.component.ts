import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import {
    PrimeInputTextComponent,
    PrimeDatepickerComponent,
    SubmitButtonsComponent,
    BeneficiariesService,
   ServiceBeneficiariesService,
   PrimeAutoCompleteComponent
} from '../../../../../shared';
@Component({
    selector: 'app-add-edit-service-beneficiary',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeInputTextComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-service-beneficiary.component.html',
    styleUrl: './add-edit-service-beneficiary.component.scss'
})
export class AddEditServiceBeneficiaryComponent extends BaseEditComponent implements OnInit {
    developmentServiceId: string = '';
    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);
    serviceBeneficiariesService = inject(ServiceBeneficiariesService);
    beneficiariesService = inject(BeneficiariesService);

    selectedBeneficiary: any = null;

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data;
        this.developmentServiceId = data?.developmentServiceId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';

        if ((this.pageType === 'edit' || this.pageType === 'view') && this.id) {
            this.getEditServiceBeneficiary();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            developmentServiceId: [this.developmentServiceId, Validators.required],
            beneficiaryId: [[], Validators.required],
        });
    }

    getEditServiceBeneficiary(): void {
        this.serviceBeneficiariesService.getEditServiceBeneficiary(this.id).subscribe((data: any) => {
            this.initFormGroup();
            const beneficiaryIds: string[] = Array.isArray(data.beneficiaryId)
                ? data.beneficiaryId
                : data.beneficiaryId
                  ? [data.beneficiaryId]
                  : [];

            this.form.patchValue({
                developmentServiceId: data.developmentServiceId ?? this.developmentServiceId,
                beneficiaryId: beneficiaryIds,
            });

            const firstId = beneficiaryIds[0];
            if (firstId) {
                this.beneficiariesService.getEditBeneficiary(firstId).subscribe((beneficiary) => (this.selectedBeneficiary = beneficiary));
            }
        });
    }

    onBeneficiarySelect(event: any) {
        if (event == null) {
            this.selectedBeneficiary = null;
            this.form.get('beneficiaryId')?.setValue([]);
            return;
        }
        this.selectedBeneficiary = event?.value ?? null;
        const id = this.selectedBeneficiary?.id;
        this.form.get('beneficiaryId')?.setValue(id ? [id] : []);
    }

    submit() {
        const beneficiaryId: string[] = this.form.get('beneficiaryId')?.value ?? [];
        if (this.form.invalid || beneficiaryId.length === 0) return;

        const payload = {
            developmentServiceId: this.form.get('developmentServiceId')?.value,
            beneficiaryId,
            ...(this.pageType === 'edit' ? { id: this.id } : {}),
        };

        if (this.pageType === 'add') {
            this.serviceBeneficiariesService.add(payload as any).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.serviceBeneficiariesService.update(payload as any).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect(): void {
        this.dialogRef.close(false);
    }
}
