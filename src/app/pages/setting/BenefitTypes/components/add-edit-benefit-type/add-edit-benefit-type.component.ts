import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, BenefitTypesService  , PrimeAutoCompleteComponent } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
    selector: 'app-add-edit-benefit-type',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent , PrimeAutoCompleteComponent],
    templateUrl: './add-edit-benefit-type.component.html',
    styleUrl: './add-edit-benefit-typel.component.scss'
})
export class AddEditBenefitTypeComponent extends BaseEditComponent implements OnInit {
    benefitTypeService : BenefitTypesService  = inject(BenefitTypesService);
  
    dialogService: DialogService = inject(DialogService);

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }


   selectedServiceName: any = null;
    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.pageType === 'edit') {
            this.getEditServiceTypeDetail();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            nameAr: ['', Validators.required],
           
        });
    }
 
  
    getEditServiceTypeDetail = () => {
        this.benefitTypeService.getEditBenefitType(this.id).subscribe((serviceTypeDetail: any) => {
            this.initFormGroup();
            this.form.patchValue(serviceTypeDetail);
             
        });
    };

    submit() {
        if (this.pageType === 'add')
            this.benefitTypeService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.benefitTypeService.update({ id: this.id, ...this.form.value }).subscribe(() => {
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
