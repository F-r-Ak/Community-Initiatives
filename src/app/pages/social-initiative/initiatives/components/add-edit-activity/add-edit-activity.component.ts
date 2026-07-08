import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import {
    PrimeInputTextComponent,
    PrimeAutoCompleteComponent,
    PrimeDatepickerComponent,
    SubmitButtonsComponent,
    ActivitiesService,
    CitiesService,
    TownsService,
    ActivityTypesService,
    ExecuteTypesService,
    EntityTypesService,
    ExecutionStatusService,
    VwOrganizationsService,
    EntitiesService
} from '../../../../../shared';
import { EntityTypes } from '../../../../../core/enums/entity-types';
import { Attachment } from '../../../../../shared/interfaces/attachment/attachment';

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
    initiativeId: string = '';

    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);

    activitiesService = inject(ActivitiesService);
    citiesService = inject(CitiesService);
    townsService = inject(TownsService);
    activityTypesService = inject(ActivityTypesService);
    executeTypesService = inject(ExecuteTypesService);
    entityTypesService = inject(EntityTypesService);
    executionStatusService = inject(ExecutionStatusService);
    organizationsService = inject(VwOrganizationsService);
    entitiesService = inject(EntitiesService);

    // Selected options for autocomplete fields
    selectedCity: any = null;
    selectedTown: any = null;
    selectedActivityType: any = null;
    selectedExecuteType: any = null;
    selectedEntityType: any = null;
    selectedExecutionStatus: any = null;
    selectedEntity: any = null;
    selectedOrganization: any = null;

    // Enum lists (non-lazy)
    entityTypesList: any[] = [];
    executionStatusList: any[] = [];
    executeTypesList: any[] = [];
    activityTypesList: any[] = [];

    // Attachment state
    selectedFiles: File[] = [];
    existingAttachments: Attachment[] = [];
    filesToDelete: string[] = [];


    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data;
        this.initiativeId = data?.initiativeId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';

        if (this.pageType === 'edit' && this.id) {
            this.getEditActivity();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            id: [null],
            initiativeId: [this.initiativeId, Validators.required],
            name: ['', Validators.required],
            cityId: [null, Validators.required],
            townId: [null, Validators.required],
            address: [''],
            activityTypeId: [null, Validators.required],
            executeTypeId: [null, Validators.required],
            startDate: [null],
            endDate: [null],
            activityTime: [null, Validators.required],
            activityManager: [''],
            entityType: [null, Validators.required],
            entityId: [null],
            vw_OrganizationId: [null],
            organizationName: [''],
            numberOfVolunteers: [0],
            numberOfBeneficiaries: [0],
            numberOfActivity: [0],
            executionStatus: [null, Validators.required],
            notes: [''],
            attachs: [[]]
        });

        // Reset entity fields when entityType changes
        this.form.get('entityType')?.valueChanges.subscribe(() => {
            this.form.get('entityId')?.setValue(null);
            this.form.get('vw_OrganizationId')?.setValue(null);
            this.selectedEntity = null;
            this.selectedOrganization = null;
        });
    }
    getEntities(body: any) {
        return this.entitiesService.getPaged(body);
    }

    getOrganizations(body: any) {
        return this.organizationsService.getPaged(body);
    }

    getEditActivity(): void {
        this.activitiesService.getEditActivity(this.id).subscribe((data: any) => {
            this.initFormGroup();
            if (data.attachs?.length) {
                this.existingAttachments = [...data.attachs];
                this.form.get('attachs')?.setValue(data.attachs);
            }
            this.form.patchValue({ ...data, attachs: data.attachs ?? [] });
            this.loadSelectedOptions(data);
        });
    }

    private loadSelectedOptions(data: any): void {
        if (data.cityId) {
            this.citiesService.getEditCity(data.cityId).subscribe((city) => (this.selectedCity = city));
        }
        if (data.townId) {
            this.townsService.getEditTown(data.townId).subscribe((town) => (this.selectedTown = town));
        }
        if (data.activityTypeId) {
            this.activityTypesService.getEditActivityType(data.activityTypeId).subscribe((at) => (this.selectedActivityType = at));
        }
        if (data.executeTypeId) {
            this.executeTypesService.getEditExecuteType(data.executeTypeId).subscribe((et) => (this.selectedExecuteType = et));
        }
        if (data.entityType) {
            this.selectedEntityType = this.entityTypesList.find((e) => e.code === data.entityType) ?? null;
        }
        if (data.executionStatus) {
            this.selectedExecutionStatus = this.executionStatusList.find((e) => e.code === data.executionStatus) ?? null;
        }
        if (data.entityId) {
            this.entitiesService.getEditEntity(data.entityId).subscribe((entity) => (this.selectedEntity = entity));
        }
        if (data.vw_OrganizationId) {
            this.organizationsService.getVwOrganization(data.vw_OrganizationId).subscribe((org) => (this.selectedOrganization = org));
        }
    }

    getEntityTypes(event: any) {
        const query = event.query.toLowerCase();
        this.entityTypesService.entityTypes.subscribe({
            next: (res) => {
                this.entityTypesList = res.filter((entityType: any) => entityType.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات أنواع جهة التنسيق');
            }
        });
    }

    getActivityTypes(event: any) {
        const query = event.query.toLowerCase();
        this.activityTypesService.activityTypes.subscribe({
            next: (res) => {
                this.activityTypesList = res.filter((activityType: any) => activityType.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات أنواع النشاط');
            }
        });
    }

    getExecutionStatus(event: any) {
        const query = event.query.toLowerCase();
        this.executionStatusService.executionStatus.subscribe({
            next: (res) => {
                this.executionStatusList = res.filter((executionStatus: any) => executionStatus.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات حالة التنفيذ');
            }
        });
    }

    getExecuteTypes(event: any) {
        const query = event.query.toLowerCase();
        this.executeTypesService.executeTypes.subscribe({
            next: (res) => {
                this.executeTypesList = res.filter((executeType: any) => executeType.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات أنواع التنفيذ');
            }
        });
    }

    // Autocomplete get methods
    getCities = (body: any) => this.citiesService.getPaged(body);
    getTowns = (body: any) => this.townsService.getPaged(body);

    // Select handlers
    onCitySelect(event: any): void {
        this.selectedCity = event?.value ?? null;
        this.form.get('cityId')?.setValue(this.selectedCity?.id ?? null);
    }

    onTownSelect(event: any): void {
        this.selectedTown = event?.value ?? null;
        this.form.get('townId')?.setValue(this.selectedTown?.id ?? null);
    }

    onActivityTypeSelect(event: any): void {
        this.selectedActivityType = event?.value ?? null;
        this.form.get('activityTypeId')?.setValue(this.selectedActivityType?.id ?? null);
    }

    onExecuteTypeSelect(event: any): void {
        this.selectedExecuteType = event?.value ?? null;
        this.form.get('executeTypeId')?.setValue(this.selectedExecuteType?.id ?? null);
    }

    onEntityTypeSelect(event: any): void {
        this.selectedEntityType = event?.value ?? null;
        this.form.get('entityType')?.setValue(this.selectedEntityType?.code ?? null);
    }

    onExecutionStatusSelect(event: any): void {
        this.selectedExecutionStatus = event?.value ?? null;
        this.form.get('executionStatus')?.setValue(this.selectedExecutionStatus?.code ?? null);
    }

    onEntitySelect(event: any): void {
        this.selectedEntity = event?.value ?? null;
        this.form.get('entityId')?.setValue(this.selectedEntity?.id ?? null);
    }

    onOrganizationSelect(event: any): void {
        this.selectedOrganization = event?.value ?? null;
        this.form.get('vw_OrganizationId')?.setValue(this.selectedOrganization?.id ?? null);
        console.log ('gg',this.selectedOrganization)
    }

    onCityClear() {
        this.selectedCity = null;
        this.selectedTown = null;
        this.form.get('cityId')?.reset();
        this.form.get('townId')?.reset();
    }

    get isDepartment(): boolean {
        return this.form.get('entityType')?.value === EntityTypes.Department;
    }

    get isOrganization(): boolean {
        return this.form.get('entityType')?.value === EntityTypes.Organization;
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
        const idx = this.existingAttachments.findIndex((a) => a.id === attachment.id);
        if (idx > -1) {
            const attachId = this.existingAttachments[idx].attachId || this.existingAttachments[idx].id;
            this.filesToDelete.push(attachId);
            this.existingAttachments.splice(idx, 1);
        }
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

    submit(): void {
        if (this.form.invalid) return;

        const formData = new FormData();
        Object.entries(this.form.value).forEach(([key, value]) => {
            if (key === 'attachs') return; // handled separately
            if (value !== null && value !== undefined) {
                if (value instanceof Date) {
                    formData.append(key, value.toISOString().split('T')[0]);
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
            this.activitiesService.add(formData).subscribe(() => this.dialogRef.close(true));
        } else {
            this.activitiesService.update(formData).subscribe(() => this.dialogRef.close(true));
        }
    }

    override redirect(): void {
        this.dialogRef.close(false);
    }
}
