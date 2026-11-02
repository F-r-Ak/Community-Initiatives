import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import {
    PrimeInputTextComponent,
    PrimeAutoCompleteComponent,
    SubmitButtonsComponent,
    NationalSupportsService,
    SupportsService,
    SupportDetailsService
} from '../../../../../shared';

@Component({
    selector: 'app-add-edit-national-support',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeInputTextComponent,
        PrimeAutoCompleteComponent,
        SubmitButtonsComponent
    ],
    templateUrl: './add-edit-national-support.component.html',
    styleUrl: './add-edit-national-support.component.scss'
})
export class AddEditNationalSupportComponent extends BaseEditComponent implements OnInit {
    nationalInitiativeDetailId: string = '';

    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);
    nationalSupportsService = inject(NationalSupportsService);
    supportsService = inject(SupportsService);
    supportDetailsService = inject(SupportDetailsService);

    selectedSupport: any = null;
    filteredSupports: any[] = [];
    selectedSupportDetail: any = null;

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data ?? {};
        this.nationalInitiativeDetailId = data?.nationalInitiativeDetailId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';

        this.initFormGroup();

        if (this.pageType === 'edit' && this.id) {
            this.loadEditData();
        }
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            id: [this.id || null],
            nationalInitiativeDetailId: [this.nationalInitiativeDetailId, Validators.required],
            support: [null, Validators.required],
            supportDetailId: [null, Validators.required],
            value: ['', Validators.required]
        });
    }

    loadEditData(): void {
        this.nationalSupportsService.getEditNationalSupport(this.id).subscribe((res: any) => {
            const data = res?.data ?? res;
            this.form.patchValue(data);

            if (data.support != null) {
                this.supportsService.supports.subscribe((supports: any[]) => {
                    this.selectedSupport = supports.find((s: any) => s.id === data.support) ?? null;
                });
            }

            if (data.supportDetailId) {
                this.supportDetailsService.getEditSupportDetail(data.supportDetailId).subscribe((detail: any) => {
                    this.selectedSupportDetail = detail?.data ?? detail;
                });
            }
        });
    }

    // Non-lazy (client-side filter) for the support type enum
    getSupports(event: any): void {
        const query = (event?.query ?? '').toLowerCase();
        this.supportsService.supports.subscribe({
            next: (res: any[]) => {
                this.filteredSupports = res.filter((s: any) =>
                    s.nameAr?.toLowerCase().includes(query)
                );
            }
        });
    }

    onSupportSelect(event: any): void {
        this.selectedSupport = event?.value ?? event;
        const val = this.selectedSupport?.id ?? null;
        this.form.get('support')?.setValue(val);
        // Cascade: clear the dependent support detail
        this.selectedSupportDetail = null;
        this.form.get('supportDetailId')?.setValue(null);
    }

    onSupportClear(): void {
        this.selectedSupport = null;
        this.form.get('support')?.setValue(null);
        this.selectedSupportDetail = null;
        this.form.get('supportDetailId')?.setValue(null);
    }

    // Lazy (server-side) for support details, filtered by selected support type
    getSupportDetails = (body: any) => {
        const support = this.form.get('support')?.value;
        return this.supportDetailsService.getDropDown({
            ...body,
            filter: { ...body?.filter, support }
        });
    };

    onSupportDetailSelect(event: any): void {
        this.selectedSupportDetail = event?.value ?? event;
        this.form.get('supportDetailId')?.setValue(this.selectedSupportDetail?.id ?? null);
    }

    onSupportDetailClear(): void {
        this.selectedSupportDetail = null;
        this.form.get('supportDetailId')?.setValue(null);
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const raw = this.form.getRawValue();
        const payload = {
            id: raw.id,
            nationalInitiativeDetailId: raw.nationalInitiativeDetailId,
            support: raw.support,
            supportDetailId: raw.supportDetailId,
            value: raw.value
        };

        if (this.pageType === 'add') {
            this.nationalSupportsService.add(payload as any).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.nationalSupportsService.update({ ...payload, id: this.id } as any).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect(): void {
        this.dialogRef.close(false);
    }
}
