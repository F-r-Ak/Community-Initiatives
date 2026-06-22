import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeInputTextComponent } from '../../../../../shared/components/primeng/p-input-text/p-input-text.component';
import { PrimeAutoCompleteComponent } from '../../../../../shared/components/primeng/p-autocomplete/p-autocomplete.component';
import { PrimeDatepickerComponent } from '../../../../../shared/components/primeng/p-datepicker/p-datepicker.component';
import { SubmitButtonsComponent } from '../../../../../shared/components/submit-buttons/submit-buttons.component';
import { ActivitiesService } from '../../../../../shared/services/activities/activities.service';
import { CitiesService } from '../../../../../shared/services/settings/cities/cities.service';
import { ActivityTypesService } from '../../../../../shared/services/settings/activity-types/activity-types.service';
import { ExecuteTypesService } from '../../../../../shared/services/settings/execute-types/execute-types.service';

@Component({
    selector: 'app-add-edit-activity',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeInputTextComponent,
        PrimeAutoCompleteComponent,
        PrimeDatepickerComponent,
        SubmitButtonsComponent
    ],
    templateUrl: './add-edit-activity.component.html',
    styleUrl: './add-edit-activity.component.scss'
})
export class AddEditActivityComponent extends BaseEditComponent implements OnInit {
    activitiesService = inject(ActivitiesService);
    citiesService = inject(CitiesService);
    activityTypesService = inject(ActivityTypesService);
    executeTypesService = inject(ExecuteTypesService);
    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);

    getCities = this.citiesService.getDropDown.bind(this.citiesService);
    getActivityTypes = this.activityTypesService.getDropDown.bind(this.activityTypesService);
    getExecuteTypes = this.executeTypesService.getDropDown.bind(this.executeTypesService);

    selectedCity: any = null;
    selectedActivityType: any = null;
    selectedExecuteType: any = null;
    initiativeId: string = '';

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data;
        this.initiativeId = data?.initiativeId ?? '';
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
            initiativeId: [this.initiativeId, Validators.required],
            name: ['', Validators.required],
            cityId: [null, Validators.required],
            activityTypeId: [null, Validators.required],
            executeTypeId: [null],
            startDate: [null, Validators.required],
            endDate: [null, Validators.required],
            activityTime: [null],
            numberOfVolunteers: [null],
            numberOfBeneficiaries: [null],
            notes: ['']
        });
    }

    getEditRecord() {
        this.activitiesService.getEditActivity(this.id).subscribe((data: any) => {
            this.initFormGroup();
            this.form.patchValue(data);
            if (data.cityId) {
                this.citiesService.getEditCity(data.cityId).subscribe((city) => (this.selectedCity = city));
            }
            if (data.activityTypeId) {
                this.activityTypesService.getEditActivityType(data.activityTypeId).subscribe((type) => (this.selectedActivityType = type));
            }
            if (data.executeTypeId) {
                this.executeTypesService.getEditExecuteType(data.executeTypeId).subscribe((type) => (this.selectedExecuteType = type));
            }
        });
    }

    onCitySelect(event: any) {
        this.selectedCity = event.value;
        this.form.get('cityId')?.setValue(this.selectedCity?.id ?? null);
    }

    onActivityTypeSelect(event: any) {
        this.selectedActivityType = event.value;
        this.form.get('activityTypeId')?.setValue(this.selectedActivityType?.id ?? null);
    }

    onExecuteTypeSelect(event: any) {
        this.selectedExecuteType = event.value;
        this.form.get('executeTypeId')?.setValue(this.selectedExecuteType?.id ?? null);
    }

    submit() {
        if (this.form.invalid) return;

        const formData = new FormData();
        Object.entries(this.form.value).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value as any);
            }
        });

        if (this.pageType === 'add') {
            this.activitiesService.add(formData).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.activitiesService.update(formData).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect() {
        this.dialogRef.close(false);
    }
}

