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
    MediaInitiativesService,
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
    selector: 'app-add-edit-media-initiatives',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-media-initiative.component.html',
    styleUrl: './add-edit-media-initiative.component.scss'
})
export class AddEditMediaInitiativeComponent extends BaseEditComponent implements OnInit {
    initiativeId: string = '';

    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);

    mediaInitiativesService = inject(MediaInitiativesService);
    
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
            this.getEditMediaInitiative();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            id: [null],
            initiativeId: [this.initiativeId, Validators.required],
            mediaTitle: [null, Validators.required],
            mediaUrl: [null, [Validators.required]],
            mediaDescription: [null, Validators.required],
        });

        // Reset entity fields when entityType changes
        this.form.get('entityType')?.valueChanges.subscribe(() => {
            this.form.get('entityId')?.setValue(null);
            this.form.get('organizationId')?.setValue(null);
            this.selectedEntity = null;
            this.selectedOrganization = null;
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

   

    getEditMediaInitiative(): void {
        this.mediaInitiativesService.getEditMediaInitiative(this.id).subscribe((data: any) => {
            this.initFormGroup();
          
            this.form.patchValue(data);
           
        });}

    
    
    
  
   submit() {
        if (this.form.invalid) return;
        const payload = this.form.value;

        if (this.pageType === 'add') {
            this.mediaInitiativesService.add(payload).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.mediaInitiativesService.update({ id: this.id, ...payload }).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect(): void {
        this.dialogRef.close(false);
    }
}
