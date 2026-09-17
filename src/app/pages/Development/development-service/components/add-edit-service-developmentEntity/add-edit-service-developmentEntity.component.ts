import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeAutoCompleteComponent, SubmitButtonsComponent, ServiceDevelopmentEntitiesService,EntitiesService,DevelopmentEntityTypesService , VwOrganizationsService ,DevelopmentEntitiesService } from '../../../../../shared';
import { AuthHelper } from '../../../../../core';
import { EnumDto } from '../../../../../shared/interfaces';
import { DevelopmentEntityTypes } from '../../../../../core/enums/DevelopmentEntityType';


  interface DevelopmentEntityType {
    entityType: EnumDto;
    entityId?: string;
    entityName?: string;
    organizationId?: number;
    organizationName?: string;
    otherEntityName?: string;
}




@Component({
    selector: 'app-add-edit-service-developmentEntity',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeAutoCompleteComponent,
        SubmitButtonsComponent
    ],
    templateUrl: './add-edit-service-developmentEntity.component.html',
    styleUrl: './add-edit-service-developmentEntity.component.scss'


})
export class AddEditServiceDevelopmentEntityComponent extends BaseEditComponent implements OnInit {
    serviceDevelopmentEntitiesService = inject(ServiceDevelopmentEntitiesService);
    entitiesService = inject(EntitiesService);
    developmentEntityTypesService = inject(DevelopmentEntityTypesService);
    vwOrganizationsService = inject(VwOrganizationsService);
    developmentEntitiesService = inject(DevelopmentEntitiesService);
    authHelper = inject(AuthHelper);
    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);
    

    otherEntityName: string = '';
    selectedOrganization : any = null;
    selectedMembers: any[] = [];
    developmentServiceId: string = '';
    entityTypesList: EnumDto[] = [];
    filteredEntityTypes: EnumDto[] = [];
    selectedEntityType: EnumDto | null = null;
    selectedEntity: any = null;
    selectedEntityPerson: any = null;
    pendingEntities: DevelopmentEntityType[] = [];

    get EntityTypes() {
          return DevelopmentEntityTypes;
      }
  
      get isOrganization(): boolean {
          return this.selectedEntityType?.nameEn === DevelopmentEntityTypes.Organization;
            
      }
  
      get isAgency(): boolean {
          return this.selectedEntityType?.nameEn === DevelopmentEntityTypes.Agency;

      }
  
      get isOther(): boolean {
          return this.selectedEntityType?.nameEn === DevelopmentEntityTypes.Other;
      }
      get isPerson(): boolean {
          return this.selectedEntityType?.nameEn === DevelopmentEntityTypes.Person;
      }
  
      get canAddRow(): boolean {
          if (!this.selectedEntityType) return false;
          if (this.isAgency) return !!this.selectedEntity;
          if (this.isPerson) return !!this.selectedEntityPerson;
          if (this.isOrganization) return !!this.selectedOrganization;
          if (this.isOther) return !!this.otherEntityName?.trim();
          return false;
      }


     constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data;
        this.developmentServiceId = data?.developmentServiceId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';
        this.initFormGroup();
        this.loadEntityTypes();
    }

    initFormGroup() {
        this.form = this.fb.group({
            
            developmentServiceId: [this.developmentServiceId, Validators.required],
         
        });
    }

     loadEntityTypes() {
        this.developmentEntityTypesService.developmentEntityTypes.subscribe((types) => {
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
        this.selectedEntityPerson = null;
        this.selectedOrganization = null;
        this.otherEntityName = '';
    }

    onEntitySelect(selected: any) {
        this.selectedEntity = selected?.value ?? null;
    }

    onOrganizationSelect(selected: any) {
        this.selectedOrganization = selected?.value ?? null;
    }
    onEntityPersonSelect(selected: any) {
        this.selectedEntityPerson = selected?.value ?? null;
    }

    addRow() {
        if (!this.canAddRow) return;

        const entry: DevelopmentEntityType = { entityType: this.selectedEntityType! };

        if (this.isAgency) {
            entry.entityId = this.selectedEntity.id;
            entry.entityName = this.selectedEntity.nameAr;
            console.log("entry:", entry);
        } else if (this.isOrganization) {
            entry.organizationId = this.selectedOrganization.id;
            entry.organizationName = this.selectedOrganization.name;
        } else if (this.isPerson) {
            entry.entityId = this.selectedEntityPerson.id;
            entry.entityName = this.selectedEntityPerson.nameAr;
        } else if (this.isOther) {
            entry.otherEntityName = this.otherEntityName.trim();
        }

        this.pendingEntities.push(entry);
         
        // Reset current row
        this.selectedEntityType = null;
        this.selectedEntity = null;
        this.selectedOrganization = null;
        this.selectedEntityPerson = null;
        this.otherEntityName = '';
    }

    removeRow(index: number) {
        this.pendingEntities.splice(index, 1);
    }

    buildPayload() {
        return {
           developmentServiceId : this.developmentServiceId,
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
        this.serviceDevelopmentEntitiesService.add(payload as any).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    override redirect() {
        this.dialogRef.close(false);
    }
}
