import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { BeneficiariesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-beneficiary',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './beneficiary.component.html',
    styleUrl: './beneficiary.component.scss'
})
export class BeneficiaryComponent extends BaseEditComponent implements OnInit {
    beneficiariesService: BeneficiariesService = inject(BeneficiariesService);
    dialogService: DialogService = inject(DialogService);
    beneficiary: Lookup | null = null;

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
            this.loadBeneficiary();
        }
    }

    loadBeneficiary(): void {
        this.beneficiariesService.getBeneficiary(this.id).subscribe((res: Lookup) => {
            this.beneficiary = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
