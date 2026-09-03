import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent, BeneficiariesService,GendersService,PrimeDatepickerComponent } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { EnumDto } from '../../../../../shared/interfaces'; 
import { DateHelper } from '../../../../../core';
@Component({
    selector: 'app-add-edit-beneficiary',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent],
    templateUrl: './add-edit-beneficiary.component.html',
    styleUrl: './add-edit-beneficiary.component.scss'
})
export class AddEditBeneficiaryComponent extends BaseEditComponent implements OnInit {
    beneficiariesService: BeneficiariesService = inject(BeneficiariesService);
    gendersService: GendersService = inject(GendersService);
    dialogService: DialogService = inject(DialogService);
    dateHelper: DateHelper = inject(DateHelper);

    genders: EnumDto[] = [];
        selectedGender: any;
        filteredGenders: EnumDto[] = [];

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
            this.getEditBeneficiaries();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
          
            address: [null, Validators.required],
            gender: ['', Validators.required],
            mobile: [null, Validators.required],
            nationalID: [null, Validators.required],
            birthDate: [null, Validators.required],
            notes: [null],
            nameAr: [null, Validators.required]

        });
    }

    getGenders(event: any) {
        const query = event.query.toLowerCase();
        this.gendersService.genders.subscribe({
            next: (res) => {
                this.filteredGenders = res.filter((gender: any) => gender.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات النوع');
            }
        });
    }


    onGenderSelect(event: any) {
       this.selectedGender = event.value;
    const genderValue = event.value?.id ?? event.value?.value ?? event.value;
    this.form.get('gender')?.setValue(genderValue);
}
   
    onGenderClear(){
        this.selectedGender = null;
        this.form.get('gender')?.reset();
    }

    getEditBeneficiaries = () => {
        this.beneficiariesService.getEditBeneficiary(this.id).subscribe((beneficiary: any) => {
            this.initFormGroup();
            this.form.patchValue(beneficiary);
            this.fetchGenderDetails(beneficiary?.genderId);
        });
    };

    fetchGenderDetails(genderId: any) {
        this.gendersService.get(genderId).subscribe((genderDetails: any) => {
            this.selectedGender = genderDetails?.data || genderDetails;
            this.form.patchValue({
                gender: genderDetails?.data?.nameEn || genderDetails?.nameEn
            });
        });
    }

    submit() {
        if (this.form.invalid) return;
        const value = {
            ...this.form.value,
            birthDate: this.dateHelper.toDateOnly(this.form.value.birthDate),
           
        };
        if (this.pageType === 'add') {
            this.beneficiariesService.add(value).subscribe((res: any) => {
                this.closeDialog();
            });
        } else {
            this.beneficiariesService.update({ id: this.id, ...value }).subscribe(() => {
                this.closeDialog();
            });
        }
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
