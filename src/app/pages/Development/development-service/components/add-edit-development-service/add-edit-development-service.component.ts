import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeInputTextComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent, SubmitButtonsComponent, DevelopmentServiceService,EntitiesService,ServiceNamesService,InitiativesService, CitiesService, TownsService, TeamMembersService } from '../../../../../shared';
import { AuthHelper, DateHelper } from '../../../../../core';
import { DevelpmentInitiativesService }from '../../../../../shared/services/develpment-initiatives/develpment-initiatives.service';
import { ServiceDevelopmentEntityTabs } from '../../../../../core/enums/service-developmententity-tabs';
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
    selector: 'app-add-edit-development-service',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, PrimeInputTextComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-development-service.component.html',
    styleUrl: './add-edit-development-service.component.scss'
})
export class AddEditDevelopmentServiceComponent extends BaseEditComponent implements OnInit {
    @Input() developmentServiceId: string = '';
    @Input() override pageType: string = 'add';
    private dateHelper = inject(DateHelper);
    developmentServicesService = inject(DevelopmentServiceService);
    citiesService = inject(CitiesService);
    townsService = inject(TownsService);
    develpmentInitiativesService = inject(DevelpmentInitiativesService);
    serviceNamesService = inject(ServiceNamesService);
    entitiesService = inject(EntitiesService);
    teamMembersService = inject(TeamMembersService);
    authHelper = inject(AuthHelper);

    getCities(body: any) {
        return this.citiesService.getPaged(body);
    }

    getTowns(body: any) {
        return this.townsService.getPaged(body);
    }

    getManagers(body: any) {
        return this.teamMembersService.getPaged({
            ...body,
            filter: { ...body.filter, teamCategory: 'Manager',
                createdById: this.authHelper.getUserId()
             }
        });
    }
getServiceNames(body: any) {
        return this.serviceNamesService.getPaged(body);
    }
    getMembers(body: any) {
        return this.teamMembersService.getPaged({
            ...body,
            filter: { ...body.filter, teamCategory: 'Member' }
        });
    }
getDevelopmentInitiatives(body: any) {
        return this.develpmentInitiativesService.getPaged(body);
    }
    getEntities(body: any) {   
        return this.entitiesService.getPaged(body);
    }

    selectedField: any = null;
    selectedCity: any = null;
    selectedTown: any = null;
    selectedManager: any = null;
    selectedDevelopmentInitiative: any = null;
    selectedEntity: any = null;
    selectedServiceName: any = null;
    selectedMembers: any[] = [];
    memberSearchSelection: any = null;

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        this.id = this.developmentServiceId ;
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
            notes: ['', Validators.required],
            serviceStartDate: ['', Validators.required],
            serviceEndDate: ['', Validators.required],
            townId: [null, Validators.required],
            cityId: [null, Validators.required],
            developmentInitiativeId: [null, Validators.required],
            serviceNameId: [null, Validators.required],
            value: ['', Validators.required],
            beneficiaryNumber: ['', Validators.required],
           entityType: ['', Validators.required],
           entityId: [null, Validators.required],
        });
    }

    getEditInitiative() {
        this.developmentServicesService.getEditDevelopmentService(this.id).subscribe((data: any) => {
            this.initFormGroup();
            this.form.patchValue(data);
            
            
            if (data.cityId) {
                this.citiesService.getEditCity(data.cityId).subscribe((city) => (this.selectedCity = city));
            }
            if (data.developmentInitiativeId) {
                this.develpmentInitiativesService.getEditDevelpmentInitiative(data.developmentInitiativeId).subscribe((developmentInitiative) => (this.selectedDevelopmentInitiative = developmentInitiative));
            }
            if (data.serviceNameId) {
                this.serviceNamesService.getEditServiceName(data.serviceNameId).subscribe((serviceName) => (this.selectedServiceName = serviceName));
            }
            if (data.initiativeMangerId) {
                this.teamMembersService.getEditTeamMember(data.initiativeMangerId).subscribe((member) => (this.selectedManager = member));
            }
            if (data.entityId) {
                this.entitiesService.getEditEntity(data.entityId).subscribe((entity) => (this.selectedEntity = entity));
            }
          
        });
    }

    onTownSelect(event: any) {
        this.selectedTown = event?.value ?? null;
        this.form.get('townId')?.setValue(this.selectedTown?.id ?? null);
    }

    onCitySelect(event: any) {
        this.selectedCity = event?.value ?? null;
        this.form.get('cityId')?.setValue(this.selectedCity?.id ?? null);
    }
    onDevelopmentInitiativeSelect(event: any) {
        this.selectedDevelopmentInitiative = event?.value ?? null;
        this.form.get('developmentInitiativeId')?.setValue(this.selectedDevelopmentInitiative?.id ?? null);
    }

    onServiceNameSelect(event: any) {
        this.selectedServiceName = event?.value ?? null;
        this.form.get('serviceNameId')?.setValue(this.selectedServiceName?.id ?? null);
    }

    onManagerSelect(event: any) {
        this.selectedManager = event?.value ?? null;
        this.form.get('initiativeMangerId')?.setValue(this.selectedManager?.id ?? null);
    }

    onEntitySelect(event: any) {
        this.selectedEntity = event?.value ?? null;
        this.form.get('entityId')?.setValue(this.selectedEntity?.id ?? null);
    }

   

    submit() {
        if (this.form.invalid) return;
        const value = {
            ...this.form.value,
            serviceStartDate: this.dateHelper.toDateOnly(this.form.value.serviceStartDate),
            serviceEndDate: this.dateHelper.toDateOnly(this.form.value.serviceEndDate)
        };
        if (this.pageType === 'add') {
            this.developmentServicesService.add(value).subscribe((res: any) => {
                this.redirect(`/pages/Development/development-service/edit/${res?.id}`);
            });
        } else {
            this.developmentServicesService.update({ id: this.id, ...value }).subscribe(() => {
                this.redirect('/pages/Development/development-service');
            });
        }
    }

    override redirect(url?: string) {
        this.route.navigate([url ?? '/pages/Development/development-service']);
    }
}
