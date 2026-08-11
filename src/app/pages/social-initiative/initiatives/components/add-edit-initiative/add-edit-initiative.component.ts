import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeInputTextComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent, SubmitButtonsComponent, InitiativesService, CitiesService, FieldsService, TeamMembersService } from '../../../../../shared';
import { AuthHelper, DateHelper } from '../../../../../core';

function minArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (!Array.isArray(value) || value.length < min) {
            return { minArrayLength: { required: min, actual: Array.isArray(value) ? value.length : 0 } };
        }
        return null;
    };
}

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
    private dateHelper = inject(DateHelper);
    initiativesService = inject(InitiativesService);
    citiesService = inject(CitiesService);
    fieldsService = inject(FieldsService);
    teamMembersService = inject(TeamMembersService);
    authHelper = inject(AuthHelper);

    getCities(body: any) {
        return this.citiesService.getPaged(body);
    }

    getFields(body: any) {
        return this.fieldsService.getPaged(body);
    }

    getManagers(body: any) {
        return this.teamMembersService.getPaged({
            ...body,
            filter: { ...body.filter, teamCategory: 'Manager',
                createdById: this.authHelper.getUserId()
             }
        });
    }

    getMembers(body: any) {
        return this.teamMembersService.getPaged({
            ...body,
            filter: { ...body.filter, teamCategory: 'Member' }
        });
    }

    selectedField: any = null;
    selectedCity: any = null;
    selectedManager: any = null;
    selectedMembers: any[] = [];
    memberSearchSelection: any = null;

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
            areas: [''],
            initiativeMangerId: [null, Validators.required],
            initiativeCategory: ['Community', Validators.required],
            teamMemberId: [[], minArrayLength(15)]
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
            if (data.teamMemberId?.length) {
                const memberRequests = data.teamMemberId.map((id: string) => this.teamMembersService.getEditTeamMember(id));
                Promise.all(memberRequests.map((obs: any) => obs.toPromise())).then((members: any[]) => {
                    this.selectedMembers = members.filter(Boolean);
                    this.form.get('teamMemberId')?.setValue(this.selectedMembers.map((m) => m.id));
                });
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

    onMemberAdd(event: any) {
        const member = event?.value ?? event;
        if (!member?.id) return;
        const alreadyAdded = this.selectedMembers.some((m) => m.id === member.id);
        if (!alreadyAdded) {
            this.selectedMembers = [...this.selectedMembers, member];
            this.syncMembersControl();
        }
        // Reset search field after adding
        setTimeout(() => (this.memberSearchSelection = null), 0);
    }

    onMemberRemove(index: number) {
        this.selectedMembers = this.selectedMembers.filter((_, i) => i !== index);
        this.syncMembersControl();
    }

    private syncMembersControl() {
        this.form.get('teamMemberId')?.setValue(this.selectedMembers.map((m) => m.id));
        this.form.get('teamMemberId')?.markAsTouched();
    }


    submit() {
        if (this.form.invalid) return;
        const value = {
            ...this.form.value,
            initiativeStartDate: this.dateHelper.toDateOnly(this.form.value.initiativeStartDate),
            initiativeEndDate: this.dateHelper.toDateOnly(this.form.value.initiativeEndDate)
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
