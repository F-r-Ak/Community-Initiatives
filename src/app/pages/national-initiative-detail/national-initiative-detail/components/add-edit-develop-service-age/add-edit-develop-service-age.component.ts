import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { PrimeAutoCompleteComponent, SubmitButtonsComponent, DevelopServiceAgesService,EntitiesService,AgeGroupsService,DevelopmentEntityTypesService , VwOrganizationsService ,DevelopmentEntitiesService } from '../../../../../shared';
import { AuthHelper } from '../../../../../core';
import { EnumDto } from '../../../../../shared/interfaces';
import { DevelopmentEntityTypes } from '../../../../../core/enums/DevelopmentEntityType';


  




@Component({
    selector: 'app-add-edit-develop-service-age',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimeAutoCompleteComponent,
        SubmitButtonsComponent
    ],
    templateUrl: './add-edit-develop-service-age.component.html',
    styleUrl: './add-edit-develop-service-age.component.scss'


})
export class AddEditDevelopServiceAgeComponent extends BaseEditComponent implements OnInit {
    developServiceAgesService = inject(DevelopServiceAgesService);
    ageGroupsService = inject(AgeGroupsService);
    entitiesService = inject(EntitiesService);
    developmentEntityTypesService = inject(DevelopmentEntityTypesService);
    vwOrganizationsService = inject(VwOrganizationsService);
    developmentEntitiesService = inject(DevelopmentEntitiesService);
    authHelper = inject(AuthHelper);
    dialogRef = inject(DynamicDialogRef);
    dialogConfig = inject(DynamicDialogConfig);
    

    otherEntityName: string = '';
    selectedOrganization : any = null;
    selectedAgeGroup: any = null;
    developmentServiceId: string = '';
    entityTypesList: EnumDto[] = [];
    filteredEntityTypes: EnumDto[] = [];
    selectedEntityType: EnumDto | null = null;
    selectedEntity: any = null;
    selectedEntityPerson: any = null;
   

    

     constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        const data = this.dialogConfig.data;
        this.developmentServiceId = data?.developmentServiceId ?? '';
        this.id = data?.id ?? '';
        this.pageType = this.id ? 'edit' : 'add';
        this.initFormGroup();
     
    }

    initFormGroup() {
        this.form = this.fb.group({
            
            developmentServiceId: [this.developmentServiceId, Validators.required],
            ageGroupId: [null, Validators.required],
            note: [null]
         
        });
    }

    
    getAgeGroups(body: any) {
        return this.ageGroupsService.getPaged(body);
    }

   
onAgeGroupSelect(event: any) {
        this.selectedAgeGroup = event?.value ?? null;
        this.form.get('ageGroupId')?.setValue(this.selectedAgeGroup?.id ?? null);
    }
     submit() {
        if (this.form.invalid) return;
        const payload = this.form.value;

        if (this.pageType === 'add') {
            this.developServiceAgesService.add(payload).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.developServiceAgesService.update({ id: this.id, ...payload }).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    override redirect() {
        this.dialogRef.close(false);
    }
}
