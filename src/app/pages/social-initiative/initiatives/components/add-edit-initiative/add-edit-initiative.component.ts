import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeInputTextComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent, SubmitButtonsComponent, InitiativesService, CitiesService, FieldsService, TeamMembersService } from '../../../../../shared';

@Component({
    selector: 'app-add-edit-initiative',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, PrimeInputTextComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-initiative.component.html',
    styleUrl: './add-edit-initiative.component.scss'
})
export class AddEditInitiativeComponent extends BaseEditComponent implements OnInit {
    @Input() initiativeId: string = '';
    @Input() override pageType: string = 'add';

    initiativesService = inject(InitiativesService);
    citiesService = inject(CitiesService);
    fieldsService = inject(FieldsService);
    teamMembersService = inject(TeamMembersService);

    getCities(body: any) {
        return this.citiesService.getPaged(body);
    }

    getFields(body: any) {
        return this.fieldsService.getPaged(body);
    }

    getManagers(body: any) {
        return this.teamMembersService.getPaged({
            ...body,
            filter: { ...body.filter, teamCategory: 'Manager' }
        });
    }
    selectedField: any = null;
    selectedCity: any = null;
    selectedManager: any = null;

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        this.id = this.initiativeId;
        if (this.pageType === 'edit' && this.id) {
            this.getEditInitiative();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            description: ['', Validators.required],
            suggestedSolution: ['', Validators.required],
            beneficiaryGroup: ['', Validators.required],
            problemDescription: ['', Validators.required],
            expectedImpact: ['', Validators.required],
            stepsExecution: ['', Validators.required],
            initiativeStartDate: ['', Validators.required],
            initiativeEndDate: ['', Validators.required],
            fieldId: [null, Validators.required],
            cityId: [null, Validators.required],
            initiativeMangerId: [null, Validators.required],
            initiativeCategory: ['Community', Validators.required]
        });
    }

    getEditInitiative() {
        this.initiativesService.getEditInitiative(this.id).subscribe((data: any) => {
            this.initFormGroup();
            this.form.patchValue(data);
            if (data.fieldId) {
                this.fieldsService.getEditField(data.fieldId).subscribe((field) => (this.selectedField = field));
            }
            if (data.cityId) {
                this.citiesService.getEditCity(data.cityId).subscribe((city) => (this.selectedCity = city));
            }
            if (data.initiativeMangerId) {
                this.teamMembersService.getEditTeamMember(data.initiativeMangerId).subscribe((member) => (this.selectedManager = member));
            }
        });
    }

    onFieldSelect(event: any) {
        this.selectedField = event?.value ?? null;
        this.form.get('fieldId')?.setValue(this.selectedField?.id ?? null);
    }

    onCitySelect(event: any) {
        this.selectedCity = event?.value ?? null;
        this.form.get('cityId')?.setValue(this.selectedCity?.id ?? null);
    }

    onManagerSelect(event: any) {
        this.selectedManager = event?.value ?? null;
        this.form.get('initiativeMangerId')?.setValue(this.selectedManager?.id ?? null);
    }

    private toDateOnly(value: any): string | null {
        if (!value) return null;
        const d = new Date(value);
        if (isNaN(d.getTime())) return null;
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    submit() {
        if (this.form.invalid) return;
        const value = {
            ...this.form.value,
            initiativeStartDate: this.toDateOnly(this.form.value.initiativeStartDate),
            initiativeEndDate: this.toDateOnly(this.form.value.initiativeEndDate)
        };
        if (this.pageType === 'add') {
            this.initiativesService.add(value).subscribe((res: any) => {
                this.redirect(`/pages/social-initiatives/initiatives/edit/${res?.id}`);
            });
        } else {
            this.initiativesService.update({ id: this.id, ...value }).subscribe(() => {
                this.redirect('/pages/social-initiatives/initiatives');
            });
        }
    }

    override redirect(url?: string) {
        this.route.navigate([url ?? '/pages/social-initiatives/initiatives']);
    }
}
