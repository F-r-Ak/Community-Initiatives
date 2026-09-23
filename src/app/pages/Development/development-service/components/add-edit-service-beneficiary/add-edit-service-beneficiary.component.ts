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
import { Attachment } from '../../../../../shared/interfaces/attachment/attachment';

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
    selectedFiles: File[] = [];
    existingAttachments: Attachment[] = [];
    filesToDelete: string[] = [];

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    private normalizeSelectedValue(event: any): any {
        if (!event) return null;

        if (typeof event === 'object') {
            if ('value' in event && event.value !== undefined && event.value !== null) {
                return event.value;
            }
            if ('id' in event && event.id !== undefined && event.id !== null) {
                return event;
            }
            if ('beneficiaryId' in event && event.beneficiaryId !== undefined && event.beneficiaryId !== null) {
                return event;
            }
        }

        return event;
    }

    private getSelectedBeneficiaryId(value: any): string | null {
        const selected = this.normalizeSelectedValue(value);

        if (!selected) return null;
        if (typeof selected === 'object') {
            return selected.id ?? selected.beneficiaryId ?? null;
        }

        return selected;
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data ?? {};
        this.developmentServiceId = data?.developmentServiceId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';

        if ((this.pageType === 'edit' || this.pageType === 'view') && this.id) {
            this.getEditMediaInitiative();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            id: [null],
            developmentServiceId: [this.developmentServiceId, Validators.required],
            beneficiaryId: [null, Validators.required]
        });
    }

    getEditMediaInitiative(): void {
        this.serviceBeneficiariesService.getEditServiceBeneficiary(this.id).subscribe((data: any) => {
            this.initFormGroup();
            this.form.patchValue(data);

            if (data.beneficiaryId) {
                this.beneficiariesService.getEditBeneficiary(data.beneficiaryId).subscribe((beneficiary) => {
                    this.selectedBeneficiary = beneficiary;
                    this.form.get('beneficiaryId')?.setValue(beneficiary?.id ?? data.beneficiaryId ?? null, { emitEvent: false });
                });
            }
        });
    }

    onBeneficiarySelect(event: any): void {
        this.selectedBeneficiary = this.normalizeSelectedValue(event);
        const beneficiaryId = this.getSelectedBeneficiaryId(this.selectedBeneficiary);

        this.form.get('beneficiaryId')?.setValue(beneficiaryId ?? null, { emitEvent: false });
    }

    submit(): void {
        const beneficiaryId = this.getSelectedBeneficiaryId(this.form.get('beneficiaryId')?.value ?? this.selectedBeneficiary);

        if (this.form.invalid || !beneficiaryId) {
            this.form.get('beneficiaryId')?.markAsTouched();
            this.form.get('beneficiaryId')?.setErrors({ required: true });
            return;
        }

        const developmentServiceId = this.form.get('developmentServiceId')?.value ?? this.developmentServiceId;
        const beneficiaryIdList = [beneficiaryId];

        if (this.pageType === 'add') {
            const payload = {
                developmentServiceId,
                beneficiaryId: beneficiaryIdList
            };

            this.serviceBeneficiariesService.add(payload as any).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            const payload = {
                id: this.id,
                developmentServiceId,
                beneficiaryId: beneficiaryIdList
            };

            this.serviceBeneficiariesService.update(payload as any).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect(): void {
        this.dialogRef.close(false);
    }
}
