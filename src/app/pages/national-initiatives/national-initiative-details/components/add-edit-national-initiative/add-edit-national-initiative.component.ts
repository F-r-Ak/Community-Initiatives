import { Component, OnInit, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import {
    PrimeInputTextComponent,
    PrimeAutoCompleteComponent,
    SubmitButtonsComponent,
    NationalInitiativesService,
    DevelpmentInitiativesService,
    BeneficiaryGroupsService,
    EntitiesService,
    ExecuteTypesService,
    ExecutionStatusService
} from '../../../../../shared';
import { Attachment } from '../../../../../shared/interfaces/attachment/attachment';
import { AuthHelper } from '../../../../../core';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-add-edit-national-initiative',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeInputTextComponent, PrimeAutoCompleteComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-national-initiative.component.html',
    styleUrl: './add-edit-national-initiative.component.scss'
})
export class AddEditNationalInitiativeComponent extends BaseEditComponent implements OnInit {
    @Output() nationalInitiativeSaved = new EventEmitter<string>();
    @Input() embeddedPageType: string | null = null;

    nationalInitiativesService = inject(NationalInitiativesService);
    develpmentInitiativesService = inject(DevelpmentInitiativesService);
    beneficiaryGroupsService = inject(BeneficiaryGroupsService);
    entitiesService = inject(EntitiesService);
    executeTypesService = inject(ExecuteTypesService);
    executionStatusService = inject(ExecutionStatusService);
    authHelper = inject(AuthHelper);

    // Selected options for autocomplete fields
    selectedDevelopmentInitiative: any = null;
    selectedBeneficiaryGroup: any = null;
    selectedEntity: any = null;
    selectedExecuteType: any = null;
    selectedExecutionStatus: any = null;

    // Enum lists (non-lazy)
    executionStatusList: any[] = [];
    executeTypesList: any[] = [];

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
            this.getEditNationalInitiative();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            id: [null],
            developmentInitiativeId: [null, Validators.required],
            beneficiaryGroupId: [null, Validators.required],
            entityId: [null, Validators.required],
            executeTypeId: [null, Validators.required],
            executionStatus: [null, Validators.required],
            problemDescription: ['', Validators.required],
            workPlan: ['', Validators.required],
            stepsExecution: [''],
            results: [''],
            attachs: [[]]
        });
    }

    private readonly editModeEnabledControls = ['executionStatus', 'problemDescription', 'workPlan', 'stepsExecution', 'results', 'attachs'];

    private disableNonEditableControls(): void {
        Object.keys(this.form.controls).forEach((key) => {
            if (!this.editModeEnabledControls.includes(key)) {
                this.form.get(key)?.disable();
            }
        });
    }

    getEditNationalInitiative(): void {
        this.nationalInitiativesService.getEditNationalInitiative(this.id).subscribe((data: any) => {
            this.initFormGroup();
            this.disableNonEditableControls();
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
            const total = 2; // executionStatus, executeTypes

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
        });
    }

    private loadSelectedOptions(data: any): void {
        if (data.developmentInitiativeId) {
            this.develpmentInitiativesService
                .getEditDevelpmentInitiative(data.developmentInitiativeId)
                .subscribe((initiative) => (this.selectedDevelopmentInitiative = initiative));
        }
        if (data.beneficiaryGroupId) {
            this.beneficiaryGroupsService
                .getEditBeneficiaryGroup(data.beneficiaryGroupId)
                .subscribe((group) => (this.selectedBeneficiaryGroup = group));
        }
        if (data.entityId) {
            this.entitiesService.getEditEntity(data.entityId).subscribe((entity) => (this.selectedEntity = entity));
        }
        if (data.executeTypeId) {
            this.executeTypesService.getEditExecuteType(data.executeTypeId).subscribe((et) => (this.selectedExecuteType = et));
        }
        if (data.executionStatus !== null && data.executionStatus !== undefined) {
            this.selectedExecutionStatus = this.executionStatusList.find((e) => +e.code === +data.executionStatus) ?? null;
        }
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

    // Autocomplete get methods (lazy, server-paged)
    getDevelopmentInitiatives = (body: any) =>
        this.develpmentInitiativesService.getPaged({
            ...body,
            filter: { ...body.filter, createdById: this.authHelper.getUserId(), "initiativeCategory": 2 }
        });

    getBeneficiaryGroups = (body: any) => this.beneficiaryGroupsService.getPaged(body);

    getEntities = (body: any) => this.entitiesService.getPaged(body);

    // Select handlers
    onDevelopmentInitiativeSelect(event: any): void {
        this.selectedDevelopmentInitiative = event?.value ?? null;
        this.form.get('developmentInitiativeId')?.setValue(this.selectedDevelopmentInitiative?.id ?? null);
    }

    onBeneficiaryGroupSelect(event: any): void {
        this.selectedBeneficiaryGroup = event?.value ?? null;
        this.form.get('beneficiaryGroupId')?.setValue(this.selectedBeneficiaryGroup?.id ?? null);
    }

    onEntitySelect(event: any): void {
        this.selectedEntity = event?.value ?? null;
        this.form.get('entityId')?.setValue(this.selectedEntity?.id ?? null);
    }

    onExecuteTypeSelect(event: any): void {
        this.selectedExecuteType = event?.value ?? null;
        this.form.get('executeTypeId')?.setValue(this.selectedExecuteType?.id ?? null);
    }

    onExecutionStatusSelect(event: any): void {
        this.selectedExecutionStatus = event?.value ?? null;
        // executionStatus is a number for national initiatives
        this.form.get('executionStatus')?.setValue(this.selectedExecutionStatus ? +this.selectedExecutionStatus.code : null);
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
                formData.append(key, value as any);
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
            this.nationalInitiativesService.add(formData).subscribe((res: any) => {
                this.redirect(`/pages/national-initiatives/initiative-details/edit/${res?.data ?? res}`);
            });
        } else {
            if (this.filesToDelete.length > 0) {
                this.nationalInitiativesService.deleteAttachments(this.filesToDelete).subscribe(() => {
                    this.filesToDelete = [];
                });
            }
            this.nationalInitiativesService.update(formData).subscribe(() => this.redirect());
        }
    }

    override redirect(url?: string) {
        this.route.navigate([url ?? '/pages/national-initiatives/initiative-details']);
    }
}
