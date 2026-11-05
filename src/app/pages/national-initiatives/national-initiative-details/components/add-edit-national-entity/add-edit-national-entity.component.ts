import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { forkJoin } from 'rxjs';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import {
    PrimeAutoCompleteComponent,
    PrimeInputTextComponent,
    SubmitButtonsComponent,
    NationalEntitiesService,
    EntitiesService,
    OrganizationsService,
    EntityTypesService
} from '../../../../../shared';
import { EnumDto } from '../../../../../shared/interfaces';
import { AddNationalEntityDto, UpdateNationalEntityDto } from '../../../../../shared/interfaces/national-entity/national-entity';
import { EntityTypes } from '../../../../../core/enums/entity-types';

/** A single queued entity row built in the dialog before submission. */
interface NationalEntityEntry {
    /** The selected entity-type enum DTO (for display in the pending table). */
    entityType: EnumDto;
    /** Numeric EntityTypes enum value (used in the DTO payload). */
    entityTypeId: EntityTypes;
    /** Resolved entity id (Department / LocalUnit / YouthCenter). */
    entityId?: string;
    entityName?: string;
    /** Resolved organization (Organization). */
    organizationId?: number;
    organizationName?: string;
    /** Free-text name (Other). */
    otherEntityName?: string;
}

@Component({
    selector: 'app-add-edit-national-entity',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        PrimeAutoCompleteComponent,
        PrimeInputTextComponent,
        SubmitButtonsComponent
    ],
    templateUrl: './add-edit-national-entity.component.html',
    styleUrl: './add-edit-national-entity.component.scss'
})
export class AddEditNationalEntityComponent extends BaseEditComponent implements OnInit {
    nationalInitiativeDetailId: string = '';

    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);
    nationalEntitiesService = inject(NationalEntitiesService);
    entitiesService = inject(EntitiesService);
    organizationsService = inject(OrganizationsService);
    entityTypesService = inject(EntityTypesService);

    /** All available entity types returned by the lookup service. */
    entityTypesList: EnumDto[] = [];
    /** Client-side filtered subset (non-lazy autocomplete). */
    filteredEntityTypes: EnumDto[] = [];

    // --- Current row being built ---
    selectedEntityType: EnumDto | null = null;
    selectedEntity: any = null;
    selectedOrganization: any = null;
    otherEntityName: string = '';

    /** Accumulated rows waiting to be submitted. */
    pendingEntities: NationalEntityEntry[] = [];

    /** Holds raw edit data until the entity-types list is loaded (race-condition guard). */
    private editData: any = null;

    /** Maps the lookup EnumDto.nameEn to the numeric EntityTypes enum value. */
    private readonly entityTypeMap: Record<string, EntityTypes> = {
        Department: EntityTypes.Department,
        Organization: EntityTypes.Organization,
        Other: EntityTypes.Other,
        LocalUnit: EntityTypes.LocalUnit,
        YouthCenter: EntityTypes.YouthCenter
    };

    /** Entity types that resolve to an existing entity record (the entity dropdown). */
    private readonly entityBackedTypes: string[] = ['Department', 'LocalUnit', 'YouthCenter'];

    get isDepartment(): boolean {
        return this.entityBackedTypes.includes(this.selectedEntityType?.nameEn ?? '');
    }

    get isOrganization(): boolean {
        return this.selectedEntityType?.nameEn === 'Organization';
    }

    get isOther(): boolean {
        return this.selectedEntityType?.nameEn === 'Other';
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
        const data = this.dialogConfig.data ?? {};
        this.nationalInitiativeDetailId = data?.nationalInitiativeDetailId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';

        this.initFormGroup();
        this.loadEntityTypes();

        if (this.pageType === 'edit' && this.id) {
            this.loadEditData();
        }
    }

    initFormGroup(): void {
        this.form = this.fb.group({
            nationalInitiativeDetailId: [this.nationalInitiativeDetailId, Validators.required],
            entityType: [null],
            entityId: [null],
            organizationId: [null],
            description: ['']
        });
    }

    loadEntityTypes(): void {
        this.entityTypesService.entityTypes.subscribe((types) => {
            this.entityTypesList = types ?? [];
            this.filteredEntityTypes = [...this.entityTypesList];
            // Resolve the entity type for an edit once the list is available.
            this.tryResolveEdit();
        });
    }

    /** Non-lazy (client-side) filter for the entity-type dropdown. */
    getEntityTypes(event: any): void {
        const query = (event?.query ?? '').toLowerCase();
        this.filteredEntityTypes = this.entityTypesList.filter((t) =>
            t.nameAr.toLowerCase().includes(query)
        );
    }

    onEntityTypeSelect(selected: any): void {
        this.selectedEntityType = selected?.value ?? null;
        // Reset the dependent selections whenever the type changes.
        this.selectedEntity = null;
        this.selectedOrganization = null;
        this.otherEntityName = '';
    }

    /** Wrapper passed to p-autocomplete so getPaged is called with the current entityType filter. */
    getEntitiesByType = (body: any) => {
        const entityTypeId = this.getEntityTypeId(this.selectedEntityType!);
        return this.entitiesService.getPaged({
            ...body,
            filter: {
                ...body.filter,
                entityType: entityTypeId
            }
        });
    };

    onEntitySelect(selected: any): void {
        this.selectedEntity = selected?.value ?? null;
    }

    onOrganizationSelect(selected: any): void {
        this.selectedOrganization = selected?.value ?? null;
    }

    /** Push the current row into the pending list and reset the inputs. */
    addRow(): void {
        if (!this.canAddRow) return;

        const entry: NationalEntityEntry = {
            entityType: this.selectedEntityType!,
            entityTypeId: this.getEntityTypeId(this.selectedEntityType!)
        };

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

        // Reset the current row so the user can add another.
        this.selectedEntityType = null;
        this.selectedEntity = null;
        this.selectedOrganization = null;
        this.otherEntityName = '';
    }

    removeRow(index: number): void {
        this.pendingEntities.splice(index, 1);
    }

    /** Builds a single AddNationalEntityDto from one pending entry. */
    private buildSinglePayload(entry: NationalEntityEntry): AddNationalEntityDto {
        const payload: any = {
            id: null,
            nationalInitiativeDetailId: this.nationalInitiativeDetailId,
            entityType: entry.entityTypeId,
            entities: [] as { entityId: string; entityType: number }[],
            organizations: [] as {
                organizationId: number;
                organizationName: string;
                otherEntityName: string;
                entityType: number;
            }[],
            description: this.form.get('description')?.value ?? ''
        };

        if (entry.entityId) {
            payload.entities = [
                { entityId: entry.entityId, entityType: entry.entityTypeId }
            ];
        } else if (entry.organizationId || entry.otherEntityName) {
            payload.organizations = [
                {
                    organizationId: entry.organizationId ?? 0,
                    organizationName: entry.organizationName ?? '',
                    otherEntityName: entry.otherEntityName ?? '',
                    entityType: entry.entityTypeId
                }
            ];
        }

        return payload as AddNationalEntityDto;
    }

    submit(): void {
        if (this.pendingEntities.length === 0) return;

        if (this.pageType === 'edit' && this.id) {
            const payload: UpdateNationalEntityDto = {
                ...this.buildSinglePayload(this.pendingEntities[0]),
                id: this.id
            } as UpdateNationalEntityDto;
            this.nationalEntitiesService.update(payload).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            // Add: one request per pending entity (the DTO carries a single entityType,
            // so mixed-type rows are submitted as independent calls).
            const requests = this.pendingEntities.map((row) =>
                this.nationalEntitiesService.add(this.buildSinglePayload(row))
            );
            forkJoin(requests).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect(): void {
        this.dialogRef.close(false);
    }

    // --- Edit support ---

    private loadEditData(): void {
        this.nationalEntitiesService.getEditNationalEntity(this.id).subscribe((res: any) => {
            this.editData = res?.data ?? res;
            this.form.patchValue({
                nationalInitiativeDetailId: this.editData?.nationalInitiativeDetailId ?? this.nationalInitiativeDetailId,
                description: this.editData?.description ?? ''
            });
            this.tryResolveEdit();
        });
    }

    /** Resolves the entity type + pending entry once both the lookup list and edit data are loaded. */
    private tryResolveEdit(): void {
        if (!this.editData || !this.entityTypesList.length || this.pendingEntities.length) return;

        const typeValue: number = this.editData.entityType;
        const match = this.entityTypesList.find(
            (t) => this.entityTypeMap[t.nameEn] === typeValue
        );
        if (!match) return;

        const entry: NationalEntityEntry = {
            entityType: match,
            entityTypeId: typeValue
        };

        if (this.editData.entityId) {
            entry.entityId = this.editData.entityId;
            entry.entityName = this.editData.entityName;
        } else if (this.editData.vw_OrganizationId) {
            entry.organizationId = this.editData.vw_OrganizationId;
            entry.organizationName = this.editData.vw_OrganizationName;
        } else if (this.editData.entityName) {
            entry.otherEntityName = this.editData.entityName;
        }

        this.pendingEntities = [entry];
    }

    /** Resolves an EnumDto to its numeric EntityTypes enum value (falls back to Other). */
    private getEntityTypeId(entityType: EnumDto): EntityTypes {
        return this.entityTypeMap[entityType.nameEn] ?? EntityTypes.Other;
    }
}
