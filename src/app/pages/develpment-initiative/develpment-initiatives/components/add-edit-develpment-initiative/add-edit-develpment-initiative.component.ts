import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, FieldsService, PrimeAutoCompleteComponent, PrimeDatepickerComponent } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { DevelpmentInitiativesService } from '../../../../../shared/services/develpment-initiatives/develpment-initiatives.service';
import { DateHelper } from '../../../../../core';

@Component({
    selector: 'app-add-edit-develpment-initiative',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent],
    templateUrl: './add-edit-develpment-initiative.component.html',
    styleUrl: './add-edit-develpment-initiative.component.scss'
})
export class AddEditDevelpmentInitiativeComponent extends BaseEditComponent implements OnInit {
    selectedField: any = null;
    develpmentInitiativesService = inject(DevelpmentInitiativesService);
    dialogService: DialogService = inject(DialogService);
    fieldsService = inject(FieldsService);
    dateHelper = inject(DateHelper);


    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.pageType === 'edit') {
            this.getEditDevelpmentInitiative();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            name: ['', Validators.required],
            fieldId: [null, Validators.required],
            initiativeStartDate: [],
            initiativeEndDate: [],
            initiativeCategory: ['Development'],

        });
    }

    getEditDevelpmentInitiative = () => {
        this.develpmentInitiativesService.getEditDevelpmentInitiative(this.id).subscribe((data: any) => {
            this.initFormGroup();
            this.form.patchValue(data);
            if (data.fieldId) {
                this.fieldsService.getEditField(data.fieldId).subscribe((field) => (this.selectedField = field));
            }
        });
    };

    submit() {
        if (this.form.invalid) return;
        const value = {
            ...this.form.value,
            initiativeStartDate: this.dateHelper.toDateOnly(this.form.value.initiativeStartDate),
            initiativeEndDate: this.dateHelper.toDateOnly(this.form.value.initiativeEndDate)
        };
        if (this.pageType === 'add') {
            this.develpmentInitiativesService.add(value).subscribe((res: any) => {
                this.closeDialog();
            });
        } else {
            this.develpmentInitiativesService.update({ id: this.id, ...value }).subscribe(() => {
                this.closeDialog();
            });
        }
    }

    getFields(body: any) {
        return this.fieldsService.getPaged(body);
    }

    onFieldSelect(event: any) {
        this.selectedField = event?.value ?? null;
        this.form.get('fieldId')?.setValue(this.selectedField?.id ?? null);
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
