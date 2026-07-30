import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import {
    PrimeAutoCompleteComponent,
    SubmitButtonsComponent,
    ActivityEntitiesService,
    EntitiesService,
    OrganizationsService,
    EntityTypesService
} from '../../../../../shared';
import { EntityTypes } from '../../../../../core/enums/entity-types';
import { EnumDto } from '../../../../../shared/interfaces';

interface ActivityEntityEntry {
    entityType: EnumDto;
    entityId?: string;
    entityName?: string;
    organizationId?: number;
    organizationName?: string;
    otherEntityName?: string;
}

@Component({
    selector: 'app-add-edit-activity-entity',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, PrimeAutoCompleteComponent, SubmitButtonsComponent],
    templateUrl: './add-edit-activity-entity.component.html',
    styleUrl: './add-edit-activity-entity.component.scss'
})
export class AddEditActivityEntityComponent extends BaseEditComponent implements OnInit {
    activityEntitiesService = inject(ActivityEntitiesService);
    entitiesService = inject(EntitiesService);
    organizationsService = inject(OrganizationsService);
    entityTypesService = inject(EntityTypesService);
    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);

    activityId: string = '';
    entityTypesList: EnumDto[] = [];
    filteredEntityTypes: EnumDto[] = [];

    // Current row being built
    selectedEntityType: EnumDto | null = null;
    selectedEntity: any = null;
    selectedOrganization: any = null;
    otherEntityName: string = '';

    // Accumulated list to submit
    pendingEntities: ActivityEntityEntry[] = [];

    get EntityTypes() {
        return EntityTypes;
    }

    get isOrganization(): boolean {
        return this.selectedEntityType?.nameEn === EntityTypes.Organization;
    }

    get isDepartment(): boolean {
        return this.selectedEntityType?.nameEn === EntityTypes.Department;
    }

    get isOther(): boolean {
        return this.selectedEntityType?.nameEn === EntityTypes.Other;
    }

    get canAddRow(): boolean {
        if (!this.selectedEntityType) return false;
        if (this.isDepartment) return !!this.selectedEntity;
        if (this.isOrganization) return !!this.selectedOrganization;
        if (this.isOther) return !!this.otherEntityName?.trim();
        return false;
    }

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data;
        this.activityId = data?.activityId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';
        this.initFormGroup();
        this.loadEntityTypes();
    }

    initFormGroup() {
        this.form = this.fb.group({
            activityId: [this.activityId, Validators.required]
        });
    }

    loadEntityTypes() {
        this.entityTypesService.entityTypes.subscribe((types) => {
            this.entityTypesList = types ?? [];
            this.filteredEntityTypes = [...this.entityTypesList];
        });
    }

    getEntityTypes(event: any) {
        const query = (event.query ?? '').toLowerCase();
        this.filteredEntityTypes = this.entityTypesList.filter((t) =>
            t.nameAr.toLowerCase().includes(query)
        );
    }

    onEntityTypeSelect(selected: any) {
        console.log("selected:", selected);
        this.selectedEntityType = selected?.value ?? null;
        this.selectedEntity = null;
        this.selectedOrganization = null;
        this.otherEntityName = '';
    }

    onEntitySelect(selected: any) {
        this.selectedEntity = selected?.value ?? null;
    }

    onOrganizationSelect(selected: any) {
        this.selectedOrganization = selected?.value ?? null;
    }

    addRow() {
        if (!this.canAddRow) return;

        const entry: ActivityEntityEntry = { entityType: this.selectedEntityType! };

        if (this.isDepartment) {
            entry.entityId = this.selectedEntity.id;
            entry.entityName = this.selectedEntity.nameAr;
        } else if (this.isOrganization) {
            entry.organizationId = this.selectedOrganization.id;
            entry.organizationName = this.selectedOrganization.name;
        } else if (this.isOther) {
            entry.otherEntityName = this.otherEntityName.trim();
        }

        this.pendingEntities.push(entry);

        // Reset current row
        this.selectedEntityType = null;
        this.selectedEntity = null;
        this.selectedOrganization = null;
        this.otherEntityName = '';
    }

    removeRow(index: number) {
        this.pendingEntities.splice(index, 1);
    }

    buildPayload() {
        return {
            activityId: this.activityId,
            entities: this.pendingEntities
                .filter((e) => e.entityId)
                .map((e) => ({ entityId: e.entityId!, entityType: e.entityType.nameEn })),
            organizations: this.pendingEntities
                .filter((e) => e.organizationId || e.otherEntityName)
                .map((e) => ({
                    organizationId: e.organizationId ?? 0,
                    organizationName: e.organizationName ?? '',
                    entityType: e.entityType.nameEn,
                    otherEntityName: e.otherEntityName ?? ''
                }))
        };
    }

    submit() {
        if (this.pendingEntities.length === 0) return;

        const payload = this.buildPayload();
        this.activityEntitiesService.add(payload as any).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    override redirect() {
        this.dialogRef.close(false);
    }
}
