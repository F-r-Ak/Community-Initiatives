import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, DevelopmentEntitiesService , PrimeAutoCompleteComponent,  DevelopmentEntityTypesService} from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
    selector: 'app-add-edit-development-entity',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent],
    templateUrl: './add-edit-development-entity.component.html',
    styleUrl: './add-edit-development-entity.component.scss'
})
export class AddEditDevelopmentEntityComponent extends BaseEditComponent implements OnInit {
    developmentEntitiesService: DevelopmentEntitiesService = inject(DevelopmentEntitiesService);
    developmentEntityTypesService: DevelopmentEntityTypesService = inject(DevelopmentEntityTypesService);
    dialogService: DialogService = inject(DialogService);

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }
  


    filteredDevelopmentEntityTypes: any[] = [];
    selectedDevelopmentEntityType: any = null;
    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.pageType === 'edit') {
            this.getEditDevelopmentEntity();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
      
            nameAr: ['', Validators.required],
            contactPersonName: [''],
            contactPersonPhone: [''],
            developmentEntityType: ['',Validators.required],
            nationalId: [''],
            notes: ['']
        });
    }

      getDevelopmentEntityTypes(event: any) {
        const query = event.query.toLowerCase();
        this.developmentEntityTypesService.developmentEntityTypes.subscribe({
            next: (res) => {
                this.filteredDevelopmentEntityTypes = res.filter((type: any) => type.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات النوع');
            }
        });
    }


    onDevelopmentEntityTypeSelect(event: any) {
       this.selectedDevelopmentEntityType = event.value;
    const developmentEntityTypeValue = event.value?.id ?? event.value?.value ?? event.value;
    this.form.get('developmentEntityType')?.setValue(developmentEntityTypeValue);
}
   
    onClear(){
        this.selectedDevelopmentEntityType = null;
        this.form.get('developmentEntityType')?.reset();
    }

    getEditDevelopmentEntity = () => {
        this.developmentEntitiesService.getEditDevelopmentEntity(this.id).subscribe((entity: any) => {
            this.initFormGroup();
            this.form.patchValue(entity);
        });
    };

    submit() {
        if (this.pageType === 'add')
            this.developmentEntitiesService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.developmentEntitiesService.update({ id: this.id, ...this.form.value }).subscribe(() => {
                this.closeDialog();
            });
    }

    override redirect() {
        if (this.dialogService.dialogComponentRefMap.size > 0) {
            this.closeDialog();
        } else {
            const currentRoute = this.route.url;
            const index = currentRoute.lastIndexOf('/');
            const str = currentRoute.substring(0, index);
            this.route.navigate([str]);
        }
    }

    closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
