import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent, SupportDetailsService, SupportsService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
    selector: 'app-add-edit-support-detail',
    standalone: true,
    imports: [CardModule, CommonModule, FormsModule, ReactiveFormsModule, SubmitButtonsComponent, PrimeInputTextComponent, PrimeAutoCompleteComponent],
    templateUrl: './add-edit-support-detail.component.html',
    styleUrl: './add-edit-support-detail.component.scss'
})
export class AddEditSupportDetailComponent extends BaseEditComponent implements OnInit {
    supportDetailsService: SupportDetailsService = inject(SupportDetailsService);
    supportsService: SupportsService = inject(SupportsService);
    dialogService: DialogService = inject(DialogService);

    selectedSupport: any;
    filteredSupportss: any[] = [];

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
            this.getEditSupportDetail();
        } else {
            this.initFormGroup();
        }
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [],
            support: [null, Validators.required],
            nameAr: ['', Validators.required]
        });
    }

    getSupports(event: any) {
        const query = event.query.toLowerCase();
        this.supportsService.supports.subscribe({
            next: (res) => {
                this.filteredSupportss = res.filter((support: any) => support.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات النوع');
            }
        });
    }


    onSupportSelect(event: any) {
       this.selectedSupport = event.value;
    const supportValue = event.value?.id ?? event.value?.value ?? event.value;
    this.form.get('support')?.setValue(supportValue);
}
   
    onSupportClear(){
        this.selectedSupport = null;
        this.form.get('support')?.reset();
    }
    getEditSupportDetail = () => {
        this.supportDetailsService.getEditSupportDetail(this.id).subscribe((supportDetail: any) => {
            this.initFormGroup();
            this.form.patchValue(supportDetail);
            this.fetchSupportDetails(supportDetail?.cityId);
        });
    };
 fetchSupportDetails(supportId: any) {
        this.supportsService.get(supportId).subscribe((supportDetails: any) => {
            this.selectedSupport = supportDetails?.data || supportDetails;
            this.form.patchValue({
                support: supportDetails?.data?.nameEn || supportDetails?.nameEn
            });
        });
    }
  
    submit() {
        if (this.pageType === 'add')
            this.supportDetailsService.add(this.form.value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.supportDetailsService.update({ id: this.id, ...this.form.value }).subscribe(() => {
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
