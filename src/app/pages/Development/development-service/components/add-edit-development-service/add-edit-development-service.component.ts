import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeInputTextComponent, PrimeDatepickerComponent, PrimeAutoCompleteComponent ,SubmitButtonsComponent,EntityTypesService, DevelopmentServiceService,EntitiesService,ServiceNamesService,InitiativesService, CitiesService, TownsService, TeamMembersService } from '../../../../../shared';
import { AuthHelper, DateHelper } from '../../../../../core';
import { DevelpmentInitiativesService }from '../../../../../shared/services/develpment-initiatives/develpment-initiatives.service';
import { ServiceDevelopmentEntityTabs } from '../../../../../core/enums/service-developmententity-tabs';
import { Attachment } from '../../../../../shared/interfaces/attachment/attachment';
import { environment } from '../../../../../../environments/environment';


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
    entityTypesService = inject(EntityTypesService);
    authHelper = inject(AuthHelper);

    getCities(body: any) {
        return this.citiesService.getPaged(body);
    }

    getTowns(body: any) {
        const filter = this.selectedCity?.id ? { ...body.filter, cityId: this.selectedCity.id } : body.filter;
        return this.townsService.getPaged({ ...body, filter });
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
   getEntityTypes() {
        return this.entityTypesService.entityTypes;
    }



    
    selectedField: any = null;
    selectedCity: any = null;
    selectedTown: any = null;
    selectedManager: any = null;
    selectedDevelopmentInitiative: any = null;
    selectedEntity: any = null;
    selectedServiceName: any = null;
    selectedEntityType: any = null;
    selectedMembers: any[] = [];
    memberSearchSelection: any = null;
    
      // Attachment state
    selectedFiles: File[] = [];
    existingAttachments: Attachment[] = [];
    filesToDelete: string[] = [];

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
            notes: [''],
            serviceStartDate: ['', Validators.required],
            serviceEndDate: ['', Validators.required],
            townId: [null, Validators.required],
            cityId: [null, Validators.required],
            developmentInitiativeId: [null, Validators.required],
            beneficiaryMaleNumber: [0, Validators.required],
            beneficiaryFemaleNumber: [0, Validators.required],
            totalBeneficiaryNumber: [0, Validators.required],
            attachs: [[]],

         
        });

        this.form.get('beneficiaryMaleNumber')?.valueChanges.subscribe(() => this.updateTotalBeneficiaryNumber());
        this.form.get('beneficiaryFemaleNumber')?.valueChanges.subscribe(() => this.updateTotalBeneficiaryNumber());
        this.updateTotalBeneficiaryNumber();
    }

    private updateTotalBeneficiaryNumber(): void {
        const male = Number(this.form.get('beneficiaryMaleNumber')?.value) || 0;
        const female = Number(this.form.get('beneficiaryFemaleNumber')?.value) || 0;
        this.form.get('totalBeneficiaryNumber')?.setValue(male + female, { emitEvent: false });
    }

    getEditInitiative() {
        this.developmentServicesService.getEditDevelopmentService(this.id).subscribe((data: any) => {
            this.initFormGroup();
            this.form.patchValue(data);
            this.updateTotalBeneficiaryNumber();
            if (data.townId) {
                this.townsService.getEditTown(data.townId).subscribe((town) => (this.selectedTown = town));
            }
            
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
          
          
        });
    }

    onTownSelect(event: any) {
        this.selectedTown = event?.value ?? null;
        this.form.get('townId')?.setValue(this.selectedTown?.id ?? null);
        const cityId = this.selectedTown?.cityId ?? null;
        this.form.get('cityId')?.setValue(cityId);
        if (cityId && this.selectedCity?.id !== cityId) {
            this.citiesService.getEditCity(cityId).subscribe((city) => (this.selectedCity = city));
        } else if (!cityId) {
            this.selectedCity = null;
        }
    }

    onCitySelect(event: any) {
        this.selectedCity = event?.value ?? null;
        this.form.get('cityId')?.setValue(this.selectedCity?.id ?? null);
        if (this.selectedTown?.cityId !== this.selectedCity?.id) {
            this.selectedTown = null;
            this.form.get('townId')?.setValue(null);
        }
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

   onEntityTypeSelect(event: any) {
        this.selectedEntityType = event?.value ?? null;
        this.form.get('entityType')?.setValue(this.selectedEntityType?.id ?? null);
    }


       // --- Attachment methods ---
    
        onFileChange(event: Event): void {
            const input = event.target as HTMLInputElement;
            if (!input.files) return;
            const newFiles = Array.from(input.files) as File[];
            this.selectedFiles.push(...newFiles);
            input.value = '';
        }
    
        removeNewFile(index: number): void {
            this.selectedFiles.splice(index, 1);
        }
    
        removeExistingAttachment(attachment: Attachment): void {
            const attachId = attachment.attachId;
            this.filesToDelete.push(attachId);
            this.existingAttachments = this.existingAttachments.filter((a) => a.id !== attachment.id);
        }
    
        getAttachmentUrl(path: string): string {
            const base = environment.HUB_URL.replace(/\/$/, '');
            const relativePath = path.replace(/^\//, '');
            return `${base}/${relativePath}`;
        }
    
        getFileIcon(fileName: string): string {
            const ext = fileName?.split('.').pop()?.toLowerCase() ?? '';
            if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'].includes(ext)) return 'pi pi-image text-info';
            if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'pi pi-video text-warning';
            if (ext === 'pdf') return 'pi pi-file-pdf text-danger';
            if (['doc', 'docx'].includes(ext)) return 'pi pi-file-word text-primary';
            if (['xls', 'xlsx'].includes(ext)) return 'pi pi-file-excel text-success';
            return 'pi pi-file text-secondary';
        }
    submit() {
        if (this.form.invalid) return;
        const value = {
            ...this.form.value,
            serviceStartDate: this.dateHelper.toDateOnly(this.form.value.serviceStartDate),
            serviceEndDate: this.dateHelper.toDateOnly(this.form.value.serviceEndDate)
        };
        
        const formData = new FormData();
        Object.entries(this.form.getRawValue()).forEach(([key, value]) => {
            if (key === 'attachs') return; // handled separately
            if (value !== null && value !== undefined) {
                if (value instanceof Date) {
                    if (key === 'activityTime') {
                        // Format as HH:mm:ss for time-only fields
                        const hh = String(value.getHours()).padStart(2, '0');
                        const mm = String(value.getMinutes()).padStart(2, '0');
                        const ss = String(value.getSeconds()).padStart(2, '0');
                        formData.append(key, `${hh}:${mm}:${ss}`);
                    } else {
                        formData.append(key, value.toISOString().split('T')[0]);
                    }
                } else {
                    formData.append(key, value as any);
                }
            }
        });

        // Append new files
        this.selectedFiles.forEach((file: File) => {
            formData.append('attachs', file, file.name);
        });

        // Append IDs of removed existing attachments
        this.filesToDelete.forEach((id) => {
            formData.append('filesToDelete', id);
        });

        if (this.pageType === 'add') {
            this.developmentServicesService.add(formData).subscribe((res: any) => {
                this.redirect(`/pages/develpment-initiatives/development-service/edit/${res?.data ?? res}`);
            });
        } else {
            if (this.filesToDelete.length > 0) {
                this.developmentServicesService.deleteAttachments(this.filesToDelete).subscribe(() => {
                    this.filesToDelete = [];
                });
            }
            this.developmentServicesService.update(formData).subscribe(() => this.redirect());
        }
    }
   

    override redirect(url?: string) {
        this.route.navigate([url ?? '/pages/develpment-initiatives/development-service']);
    }
}