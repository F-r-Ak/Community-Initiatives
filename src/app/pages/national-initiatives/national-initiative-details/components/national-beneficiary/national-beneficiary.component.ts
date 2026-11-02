import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseComponent } from '../../../../../base/components/base-component';
import { CentralBeneficiariesService } from '../../../../../shared';
import { CentralBeneficiaryDto } from '../../../../../shared';
import { AddEditNationalBeneficiaryComponent } from '../add-edit-national-beneficiary/add-edit-national-beneficiary.component';

@Component({
    selector: 'app-national-beneficiary',
    standalone: true,
    imports: [CommonModule, RouterModule],
    providers: [DialogService],
    templateUrl: './national-beneficiary.component.html',
    styleUrl: './national-beneficiary.component.scss'
})
export class NationalBeneficiaryComponent extends BaseComponent implements OnInit {
    id: string = '';
    beneficiary: CentralBeneficiaryDto | null = null;
    isLoading: boolean = true;

    centralBeneficiariesService = inject(CentralBeneficiariesService);
    dialogService = inject(DialogService);

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.id = this.activatedRoute.snapshot.paramMap.get('id') || '';
        if (this.id) {
            this.loadData();
        }
    }

    loadData(): void {
        this.isLoading = true;
        this.centralBeneficiariesService.getCentralBeneficiary(this.id).subscribe({
            next: (data: any) => {
                this.beneficiary = data?.data ?? data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    openEditDialog(): void {
        const ref = this.dialogService.open(AddEditNationalBeneficiaryComponent, {
            header: 'تعديل مستفيد',
            width: '50rem',
            contentStyle: { direction: 'rtl' },
            data: {
                id: this.id,
                nationalInitiativeDetailId: this.beneficiary?.nationalInitiativeDetailId ?? ''
            }
        });

        ref.onClose.subscribe((changed: boolean) => {
            if (changed) {
                this.loadData();
            }
        });
    }

    navigateBack(): void {
        if (this.beneficiary?.nationalInitiativeDetailId) {
            this.route.navigate([
                `/pages/national-initiatives/initiative-details/view/${this.beneficiary.nationalInitiativeDetailId}`
            ]);
        } else {
            this.route.navigate(['/pages/national-initiatives/initiative-details']);
        }
    }
}
