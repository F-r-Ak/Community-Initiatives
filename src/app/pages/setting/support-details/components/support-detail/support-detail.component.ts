import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { SupportDetailsService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-support-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './support-detail.component.html',
    styleUrl: './support-detail.component.scss'
})
export class SupportDetailComponent extends BaseEditComponent implements OnInit {
    supportDetailsService: SupportDetailsService = inject(SupportDetailsService);
    dialogService: DialogService = inject(DialogService);
    supportDetail: Lookup | null = null;

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'view') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.id) {
            this.loadSupportDetail();
        }
    }

    loadSupportDetail(): void {
        this.supportDetailsService.getSupportDetail(this.id).subscribe((res: Lookup) => {
            this.supportDetail = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
