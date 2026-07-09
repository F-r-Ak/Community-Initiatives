import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { BeneficiaryGroupsService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-beneficiary-group',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './beneficiary-group.component.html',
    styleUrl: './beneficiary-group.component.scss'
})
export class BeneficiaryGroupComponent extends BaseEditComponent implements OnInit {
    beneficiaryGroupsService: BeneficiaryGroupsService = inject(BeneficiaryGroupsService);
    dialogService: DialogService = inject(DialogService);
    beneficiaryGroup: Lookup | null = null;

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
            this.loadBeneficiaryGroup();
        }
    }

    loadBeneficiaryGroup(): void {
        this.beneficiaryGroupsService.getBeneficiaryGroup(this.id).subscribe((res: Lookup) => {
            this.beneficiaryGroup = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
