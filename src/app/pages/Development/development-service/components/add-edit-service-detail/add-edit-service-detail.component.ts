import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeAutoCompleteComponent, SubmitButtonsComponent, PrimeInputTextComponent,ServiceDetailsService,EntitiesService,ServiceNamesService,BenefitPeriodService,BenefitTypesService,ServiceTypeDetailsService,DevelopmentEntityTypesService , VwOrganizationsService ,DevelopmentEntitiesService } from '../../../../../shared';
import { AuthHelper } from '../../../../../core';
import { EnumDto } from '../../../../../shared/interfaces';
import { DevelopmentEntityTypes } from '../../../../../core/enums/DevelopmentEntityType';
import { of } from 'rxjs';


  interface DevelopmentEntityType {
    entityType: EnumDto;
    entityId?: string;
    entityName?: string;
    organizationId?: number;
    organizationName?: string;
    otherEntityName?: string;
}




@Component({
    selector: 'app-add-edit-service-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeAutoCompleteComponent,
        PrimeInputTextComponent,
        SubmitButtonsComponent
    ],
    templateUrl: './add-edit-service-detail.component.html',
    styleUrl: './add-edit-service-detail.component.scss'


})
export class AddEditServiceDetailComponent extends BaseEditComponent implements OnInit {
    serviceDetailsService = inject(ServiceDetailsService);
    serviceNameService = inject(ServiceNamesService);
    serviceTypeDetailsService = inject(ServiceTypeDetailsService);
    benefitTypesService = inject(BenefitTypesService);
    benefitPeriodService = inject(BenefitPeriodService);
    entitiesService = inject(EntitiesService);
    developmentEntityTypesService = inject(DevelopmentEntityTypesService);
    vwOrganizationsService = inject(VwOrganizationsService);
    developmentEntitiesService = inject(DevelopmentEntitiesService);
    authHelper = inject(AuthHelper);
    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);
    
    selectServiceName : any = null;
    selectserviceTypeDetail : any = null;
   selectedBenefitPeriod : any = null;
 filteredBenefitPeriods: EnumDto[] = [];
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
    filteredServiceName: EnumDto[] = [];

    
    // get EntityTypes() {
    //       return DevelopmentEntityTypes;
    //   }
  
    //   get isOrganization(): boolean {
    //       return this.selectedEntityType?.nameEn === DevelopmentEntityTypes.Organization;
            
    //   }
  
    //   get isAgency(): boolean {
    //       return this.selectedEntityType?.nameEn === DevelopmentEntityTypes.Agency;

    //   }
  
    //   get isOther(): boolean {
    //       return this.selectedEntityType?.nameEn === DevelopmentEntityTypes.Other;
    //   }
    //   get isPerson(): boolean {
    //       return this.selectedEntityType?.nameEn === DevelopmentEntityTypes.Person;
    //   }
  
    //   get canAddRow(): boolean {
    //       if (!this.selectedEntityType) return false;
    //       if (this.isAgency) return !!this.selectedEntity;
    //       if (this.isPerson) return !!this.selectedEntityPerson;
    //       if (this.isOrganization) return !!this.selectedOrganization;
    //       if (this.isOther) return true;
    //       return false;
    //   }


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
            serviceTypeDetailId : [null ,Validators.required],
            value : [''],
            notes : [''],
            benefitPeriod : [null],
            benefitTypeId : [null],

         
        });
    }



    getServiceName(body: any) {
        return this.serviceNameService.getPaged(body);
    }
     getServiceTypeDetail(body: any) {
        const serviceNameId = this.selectServiceName?.id;
        if (!serviceNameId) return of({ data: [], totalCount: 0 });

        return this.serviceTypeDetailsService.getPaged({
            ...body,
            filter: { ...body.filter, serviceNameId }
        });
    }
    getBenefitPeriods(event: any) {
        const query = event.query.toLowerCase();
        this.benefitPeriodService.benefitPeriod.subscribe({
            next: (res) => {
                this.filteredBenefitPeriods = res.filter((period: any) => period.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات النوع');
            }
        });
    }


    onbenefitPeriodSelect(event: any) {
       this.selectedBenefitPeriod = event.value;
    const benefitPeriodValue = event.value?.id ?? event.value?.value ?? event.value;
    this.form.get('benefitPeriod')?.setValue(benefitPeriodValue);
}
   
    getBenefitTypes(body: any) {
        return this.benefitTypesService.getPaged(body);
    }
     loadEntityTypes() {
        this.developmentEntityTypesService.developmentEntityTypes.subscribe((types) => {
            this.entityTypesList = types ?? [];
            this.filteredEntityTypes = [...this.entityTypesList];
        });
    }

    // getEntityTypes(event: any) {
    //     const query = (event.query ?? '').toLowerCase();
    //     this.filteredEntityTypes = this.entityTypesList.filter((t) =>
    //         t.nameAr.toLowerCase().includes(query)
    //     );
    // }

    // onEntityTypeSelect(selected: any) {
    //     console.log("selected:", selected);
    //     this.selectedEntityType = selected?.value ?? null;
    //     this.selectedEntity = null;
    //     this.selectedEntityPerson = null;
    //     this.selectedOrganization = null;
    //     this.otherEntityName = '';
    // }

   onServiceNameSelect(event: any) {
        this.selectServiceName = event?.value ?? null;
        this.selectserviceTypeDetail = null;
        this.form.get('serviceTypeDetailId')?.setValue(null);
    }
 onserviceTypeDetailSelect(event: any) {
        this.selectserviceTypeDetail = event?.value ?? null;
        this.form.get('serviceTypeDetailId')?.setValue(this.selectserviceTypeDetail?.id ?? null);
    }

    // onOrganizationSelect(selected: any) {
    //     this.selectedOrganization = selected?.value ?? null;
    // }
    // onEntityPersonSelect(selected: any) {
    //     this.selectedEntityPerson = selected?.value ?? null;
    // }

    // addRow() {
    //     if (!this.canAddRow) return;

    //     const entry: DevelopmentEntityType = { entityType: this.selectedEntityType! };

    //     if (this.isAgency) {
    //         entry.entityId = this.selectedEntity.id;
    //         entry.entityName = this.selectedEntity.nameAr;
    //         console.log("entry:", entry);
    //     } else if (this.isOrganization) {
    //         entry.organizationId = this.selectedOrganization.id;
    //         entry.organizationName = this.selectedOrganization.name;
    //     } else if (this.isPerson) {
    //         entry.entityId = this.selectedEntityPerson.id;
    //         entry.entityName = this.selectedEntityPerson.nameAr;
    //     } else if (this.isOther) {
    //         entry.otherEntityName = this.selectedEntityType!.nameAr;
    //     }

    //     this.pendingEntities.push(entry);
         
    //     // Reset current row
    //     this.selectedEntityType = null;
    //     this.selectedEntity = null;
    //     this.selectedOrganization = null;
    //     this.selectedEntityPerson = null;
    //     this.otherEntityName = '';
    // }

    // removeRow(index: number) {
    //     this.pendingEntities.splice(index, 1);
    // }

    // buildPayload() {
    //     return {
    //        developmentServiceId : this.developmentServiceId,
    //         entities: this.pendingEntities
    //             .filter((e) => e.entityId)
    //             .map((e) => ({ entityId: e.entityId!, entityType: e.entityType.nameEn })),
    //         organizations: this.pendingEntities
    //             .filter((e) => e.organizationId || e.otherEntityName)
    //             .map((e) => ({
    //                 organizationId: e.organizationId ?? 0,
    //                 organizationName: e.organizationName ?? '',
    //                 entityType: e.entityType.nameEn,
    //                 otherEntityName: e.otherEntityName ?? ''
    //             }))
    //     };
    // }

      submit() {
        if (this.form.invalid) return;
        const payload = this.form.value;

        if (this.pageType === 'add') {
            this.serviceDetailsService.add(payload).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.serviceDetailsService.update({ id: this.id, ...payload }).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect() {
        this.dialogRef.close(false);
    }
}
