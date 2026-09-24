import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeInputTextComponent,
        PrimeDatepickerComponent,
        PrimeAutoCompleteComponent,
        SubmitButtonsComponent
    ],
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
    pendingBeneficiaries: any[] = [];
    selectedFiles: File[] = [];
    existingAttachments: Attachment[] = [];
    filesToDelete: string[] = [];

    get canAddRow(): boolean {
        const id = this.getSelectedBeneficiaryId(this.selectedBeneficiary);
        return !!id;
    }

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    private normalizeSelectedValue(event: any): any {
        if (!event) return null;

        if (typeof event === 'object') {
            if ('value' in event && event.value !== undefined && event.value !== null) {
                return event.value;
            }
            if ('id' in event || 'beneficiaryId' in event) {
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

        this.initFormGroup();

        if ((this.pageType === 'edit' || this.pageType === 'view') && this.id) {
            this.getEditMediaInitiative();
        }
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            id: [this.id || null],
            developmentServiceId: [this.developmentServiceId],
            beneficiaryId: [null]
        });
    }

    getEditMediaInitiative(): void {
        this.serviceBeneficiariesService.getEditServiceBeneficiary(this.id).subscribe((data: any) => {
            this.form.patchValue(data);

            if (data.beneficiaryId) {
                this.beneficiariesService.getEditBeneficiary(data.beneficiaryId).subscribe((beneficiary) => {
                    if (beneficiary) {
                        this.selectedBeneficiary = beneficiary;
                        this.pendingBeneficiaries = [beneficiary];
                    }
                });
            }
        });
    }

    onBeneficiarySelect(event: any): void {
        this.selectedBeneficiary = this.normalizeSelectedValue(event);
        const beneficiaryId = this.getSelectedBeneficiaryId(this.selectedBeneficiary);
        this.form.get('beneficiaryId')?.setValue(beneficiaryId, { emitEvent: false });
    }

    addRow(): void {
        if (!this.canAddRow) return;

        const currentId = this.getSelectedBeneficiaryId(this.selectedBeneficiary);
        const isAlreadyAdded = this.pendingBeneficiaries.some((item) => {
            const itemId = this.getSelectedBeneficiaryId(item);
            return itemId === currentId;
        });

        if (!isAlreadyAdded) {
            this.pendingBeneficiaries.push({ ...this.selectedBeneficiary });
        }

        this.clearSelection();
    }

    removeRow(index: number): void {
        this.pendingBeneficiaries.splice(index, 1);
    }

    private clearSelection(): void {
        this.selectedBeneficiary = null;
        this.form.get('beneficiaryId')?.setValue(null, { emitEvent: false });
    }

    submit(): void {
        const beneficiaryIds = this.pendingBeneficiaries
            .map((item) => this.getSelectedBeneficiaryId(item))
            .filter((id): id is string => !!id);

        if (beneficiaryIds.length === 0) {
            this.form.get('beneficiaryId')?.markAsTouched();
            this.form.get('beneficiaryId')?.setErrors({ required: true });
            return;
        }

        const developmentServiceId = this.form.get('developmentServiceId')?.value || this.developmentServiceId;

        if (this.pageType === 'add') {
            const payload = {
                developmentServiceId,
                beneficiaryId: beneficiaryIds
            };

            this.serviceBeneficiariesService.add(payload as any).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            const payload = {
                id: this.id,
                developmentServiceId,
                beneficiaryId: beneficiaryIds
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