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
    CentralBeneficiariesService,
    CitiesService,
    TownsService
} from '../../../../../shared';


@Component({
    selector: 'app-add-edit-national-beneficiary',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeInputTextComponent,
        PrimeAutoCompleteComponent,
        SubmitButtonsComponent
    ],
    templateUrl: './add-edit-national-beneficiary.component.html',
    styleUrl: './add-edit-national-beneficiary.component.scss'
})
export class AddEditNationalBeneficiaryComponent extends BaseEditComponent implements OnInit {
    nationalInitiativeDetailId: string = '';

    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);
    centralBeneficiariesService = inject(CentralBeneficiariesService);
    citiesService = inject(CitiesService);
    townsService = inject(TownsService);

    selectedCity: any = null;
    selectedTown: any = null;

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
            cityId: [null, Validators.required],
            townId: [null, Validators.required],
            beneficiaryMaleNumber: [0, [Validators.required, Validators.min(0)]],
            beneficiaryFemaleNumber: [0, [Validators.required, Validators.min(0)]],
            totalBeneficiaryNumber: [{ value: 0, disabled: true }]
        });

        // Auto-calculate total
        const updateTotal = () => {
            const male = +(this.form.get('beneficiaryMaleNumber')?.value ?? 0);
            const female = +(this.form.get('beneficiaryFemaleNumber')?.value ?? 0);
            this.form.get('totalBeneficiaryNumber')?.setValue(male + female, { emitEvent: false });
        };

        this.form.get('beneficiaryMaleNumber')?.valueChanges.subscribe(updateTotal);
        this.form.get('beneficiaryFemaleNumber')?.valueChanges.subscribe(updateTotal);
    }

    loadEditData(): void {
        this.centralBeneficiariesService.getEditCentralBeneficiary(this.id).subscribe((data: any) => {
            this.form.patchValue(data);

            if (data.cityId) {
                this.citiesService.getEditCity(data.cityId).subscribe((city: any) => {
                    this.selectedCity = city?.data ?? city;
                });
            }
            if (data.townId) {
                this.townsService.getEditTown(data.townId).subscribe((town: any) => {
                    this.selectedTown = town?.data ?? town;
                });
            }

            // Recalculate total after patch
            const male = +(data.beneficiaryMaleNumber ?? 0);
            const female = +(data.beneficiaryFemaleNumber ?? 0);
            this.form.get('totalBeneficiaryNumber')?.setValue(male + female, { emitEvent: false });
        });
    }

    getCities = (body: any) => this.citiesService.getPaged(body);

    getTowns = (body: any) => {
        const cityId = this.form.get('cityId')?.value;
        return this.townsService.getPaged({ ...body, filter: { ...body?.filter, cityId } });
    };

    onCitySelect(event: any): void {
        this.selectedCity = event?.value ?? event;
        this.form.get('cityId')?.setValue(this.selectedCity?.id ?? null);
        // Clear dependent town
        this.selectedTown = null;
        this.form.get('townId')?.setValue(null);
    }

    onCityClear(): void {
        this.selectedCity = null;
        this.form.get('cityId')?.setValue(null);
        this.selectedTown = null;
        this.form.get('townId')?.setValue(null);
    }

    onTownSelect(event: any): void {
        this.selectedTown = event?.value ?? event;
        this.form.get('townId')?.setValue(this.selectedTown?.id ?? null);
    }

    onTownClear(): void {
        this.selectedTown = null;
        this.form.get('townId')?.setValue(null);
    }

    submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const raw = this.form.getRawValue();

        if (this.pageType === 'add') {
            const payload = {
                id: raw.id,
                nationalInitiativeDetailId: raw.nationalInitiativeDetailId,
                cityId: raw.cityId,
                townId: raw.townId,
                beneficiaryMaleNumber: +raw.beneficiaryMaleNumber,
                beneficiaryFemaleNumber: +raw.beneficiaryFemaleNumber,
                totalBeneficiaryNumber: +raw.totalBeneficiaryNumber
            };
            this.centralBeneficiariesService.add(payload as any).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            const payload = {
                id: this.id,
                nationalInitiativeDetailId: raw.nationalInitiativeDetailId,
                cityId: raw.cityId,
                townId: raw.townId,
                beneficiaryMaleNumber: +raw.beneficiaryMaleNumber,
                beneficiaryFemaleNumber: +raw.beneficiaryFemaleNumber,
                totalBeneficiaryNumber: +raw.totalBeneficiaryNumber
            };
            this.centralBeneficiariesService.update(payload as any).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect(): void {
        this.dialogRef.close(false);
    }
}
