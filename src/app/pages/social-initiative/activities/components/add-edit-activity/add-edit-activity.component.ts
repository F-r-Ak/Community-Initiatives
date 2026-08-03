import { Component, OnInit, inject, Optional, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    ExecutionStatusService,
    InitiativesService
} from '../../../../../shared';
import { Attachment } from '../../../../../shared/interfaces/attachment/attachment';
import { AuthHelper } from '../../../../../core';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-add-edit-activity',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-activity.component.html',
    styleUrl: './add-edit-activity.component.scss'
})
export class AddEditActivityComponent extends BaseEditComponent implements OnInit {
    @Output() activitySaved = new EventEmitter<string>();
    @Input() embeddedPageType: string | null = null;
    activitiesService = inject(ActivitiesService);
    initiativesService = inject(InitiativesService);
    citiesService = inject(CitiesService);
    townsService = inject(TownsService);
    activityTypesService = inject(ActivityTypesService);
    executeTypesService = inject(ExecuteTypesService);
    executionStatusService = inject(ExecutionStatusService);
    authHelper = inject(AuthHelper);

    // Selected options for autocomplete fields
    selectedInitiative: any = null;
    selectedCity: any = null;
    selectedTown: any = null;
    selectedActivityType: any = null;
    selectedExecuteType: any = null;
    selectedExecutionStatus: any = null;

    // Enum lists (non-lazy)
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
        super.ngOnInit();
        // Allow parent to override pageType when embedded as a child component
        if (this.embeddedPageType) {
            this.pageType = this.embeddedPageType;
        }

        if (this.pageType === 'edit' && this.id) {
            this.getEditActivity();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            id: [null],
            initiativeId: [null, Validators.required],
            name: ['', Validators.required],
            cityId: [null, Validators.required],
            townId: [null, Validators.required],
            areas: [''],
            address: [''],
            activityTypeId: [null, Validators.required],
            executeTypeId: [null, Validators.required],
            startDate: [null],
            endDate: [null],
            activityTime: [null, Validators.required],
            activityManger: [''],
            numberOfVolunteers: [0],
            numberOfBeneficiaries: [0, Validators.required],
            numberOfFemaleBeneficiaries: [0, Validators.required],
            numberOfMaleBeneficiaries: [0, Validators.required],
            numberOfActivity: [0],
            executionStatus: [null, Validators.required],
            notes: [''],
            attachs: [[]]
        });

        // Auto-calculate numberOfBeneficiaries and disable it
        const updateBeneficiaries = () => {
            const female = this.form.get('numberOfFemaleBeneficiaries')?.value ?? 0;
            const male = this.form.get('numberOfMaleBeneficiaries')?.value ?? 0;
            this.form.get('numberOfBeneficiaries')?.setValue(+female + +male, { emitEvent: false });
        };

        this.form.get('numberOfFemaleBeneficiaries')?.valueChanges.subscribe(updateBeneficiaries);
        this.form.get('numberOfMaleBeneficiaries')?.valueChanges.subscribe(updateBeneficiaries);
        this.form.get('numberOfBeneficiaries')?.disable();
    }

    getInitiatives(body: any) {
        return this.initiativesService.getPaged({
            ...body,
            filter: { ...body.filter, createdById: this.authHelper.getUserId() }
        });
    }

    getEditActivity(): void {
        this.activitiesService.getEditActivity(this.id).subscribe((data: any) => {
            this.initFormGroup();
            if (data.attachs?.length) {
                this.existingAttachments = [...data.attachs];
                this.form.get('attachs')?.setValue(data.attachs);
            }
            this.form.patchValue({ ...data, attachs: data.attachs ?? [] });

            // Load enum lists first before setting selected options
            this.loadEnumLists().then(() => {
                this.loadSelectedOptions(data);
            });
        });
    }

    private loadEnumLists(): Promise<void> {
        return new Promise((resolve) => {
            let completed = 0;
            const total = 3; // executionStatus, executeTypes, activityTypes

            const checkComplete = () => {
                completed++;
                if (completed === total) resolve();
            };

            this.executionStatusService.executionStatus.subscribe({
                next: (res) => {
                    this.executionStatusList = res;
                    checkComplete();
                },
                error: () => checkComplete()
            });

            this.executeTypesService.executeTypes.subscribe({
                next: (res) => {
                    this.executeTypesList = res;
                    checkComplete();
                },
                error: () => checkComplete()
            });

            this.activityTypesService.activityTypes.subscribe({
                next: (res) => {
                    this.activityTypesList = res;
                    checkComplete();
                },
                error: () => checkComplete()
            });
        });
    }

    private loadSelectedOptions(data: any): void {
        if (data.cityId) {
            this.citiesService.getEditCity(data.cityId).subscribe((city) => (this.selectedCity = city));
        }
        if (data.initiativeId) {
            this.initiativesService.getEditInitiative(data.initiativeId).subscribe((initiative) => (this.selectedInitiative = initiative));
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
        if (data.executionStatus) {
            this.selectedExecutionStatus = this.executionStatusList.find((e) => e.code === data.executionStatus) ?? null;
        }
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

    getTowns = (body: any) => {
        const cityId = this.form.get('cityId')?.value;
        return this.townsService.getPaged({ ...body, filter: { ...body.filter, cityId } });
    };

    // Select handlers
    onCitySelect(event: any): void {
        this.selectedCity = event?.value ?? null;
        this.form.get('cityId')?.setValue(this.selectedCity?.id ?? null);
        // Reset town when city changes
        this.selectedTown = null;
        this.form.get('townId')?.reset();
    }

    onInitiativeSelect(event: any): void {
        this.selectedInitiative = event?.value ?? null;
        this.form.get('initiativeId')?.setValue(this.selectedInitiative?.id ?? null);
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

    onExecutionStatusSelect(event: any): void {
        this.selectedExecutionStatus = event?.value ?? null;
        this.form.get('executionStatus')?.setValue(this.selectedExecutionStatus?.code ?? null);
    }

    onCityClear() {
        this.selectedCity = null;
        this.selectedTown = null;
        this.form.get('cityId')?.reset();
        this.form.get('townId')?.reset();
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

    submit(): void {
        if (this.form.invalid) return;

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
            this.activitiesService.add(formData).subscribe((res: any) => {
                this.redirect(`/pages/social-initiatives/activities/edit/${res?.data ?? res}`);
            });
        } else {
            if (this.filesToDelete.length > 0) {
                this.activitiesService.deleteAttachments(this.filesToDelete).subscribe(() => {
                    this.filesToDelete = [];
                });
            }
            this.activitiesService.update(formData).subscribe(() => this.redirect());
        }
    }

    override redirect(url?: string) {
        this.route.navigate([url ?? '/pages/social-initiatives/activities']);
    }
}
