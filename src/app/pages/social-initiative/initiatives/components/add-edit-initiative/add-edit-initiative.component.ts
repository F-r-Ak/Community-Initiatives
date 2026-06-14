import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeInputTextComponent } from '../../../../../shared/components/primeng/p-input-text/p-input-text.component';
import { PrimeAutoCompleteComponent } from '../../../../../shared/components/primeng/p-autocomplete/p-autocomplete.component';
import { SubmitButtonsComponent } from '../../../../../shared/components/submit-buttons/submit-buttons.component';
import { InitiativesService } from '../../../../../shared/services/initiatives/initiatives.service';
import { CitiesService } from '../../../../../shared/services/settings/cities/cities.service';
import { FieldsService } from '../../../../../shared/services/settings/fields/fields.service';
import { TeamMembersService } from '../../../../../shared/services/settings/team-members/team-members.service';

@Component({
    selector: 'app-add-edit-initiative',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CardModule,
        PrimeInputTextComponent,
        PrimeAutoCompleteComponent,
        SubmitButtonsComponent
    ],
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

    getCities = this.citiesService.getDropDown.bind(this.citiesService);
    getFields = this.fieldsService.getDropDown.bind(this.fieldsService);
    getTeamMembers = this.teamMembersService.getDropDown.bind(this.teamMembersService);

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
            suggestedSolution: [''],
            beneficiaryGroup: [''],
            problemDescription: [''],
            expectedImpact: [''],
            stepsExecution: [''],
            fieldId: [null, Validators.required],
            cityId: [null, Validators.required],
            initiativeMangerId: [null, Validators.required]
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
        this.selectedField = event.value;
        this.form.get('fieldId')?.setValue(this.selectedField?.id);
    }

    onCitySelect(event: any) {
        this.selectedCity = event.value;
        this.form.get('cityId')?.setValue(this.selectedCity?.id);
    }

    onManagerSelect(event: any) {
        this.selectedManager = event.value;
        this.form.get('initiativeMangerId')?.setValue(this.selectedManager?.id);
    }

    submit() {
        if (this.form.invalid) return;
        if (this.pageType === 'add') {
            this.initiativesService.add(this.form.value).subscribe((res: any) => {
                this.redirect(`social-initiatives/initiatives/edit/${res.id}`);
            });
        } else {
            this.initiativesService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.redirect('social-initiatives/initiatives');
            });
        }
    }

    override redirect(url?: string) {
        this.route.navigate([url ?? 'social-initiatives/initiatives']);
    }
}
