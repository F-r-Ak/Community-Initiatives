import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from '../../../../../base/components/base-component';
import { NationalSupportsService } from '../../../../../shared';
import { NationalSupportDto } from '../../../../../shared';
import { AddEditNationalSupportComponent } from '../add-edit-national-support/add-edit-national-support.component';

@Component({
    selector: 'app-national-support',
    standalone: true,
    imports: [CommonModule, RouterModule],
    providers: [DialogService],
    templateUrl: './national-support.component.html',
    styleUrl: './national-support.component.scss'
})
export class NationalSupportComponent extends BaseComponent implements OnInit {
    id: string = '';
    support: NationalSupportDto | null = null;
    isLoading: boolean = true;

    nationalSupportsService = inject(NationalSupportsService);
    dialogService = inject(DialogService);
    dialogRef: DynamicDialogRef | undefined;

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
        this.nationalSupportsService.getNationalSupport(this.id).subscribe({
            next: (data: any) => {
                this.support = data?.data ?? data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    openEditDialog(): void {
        this.dialogRef = this.dialogService.open(AddEditNationalSupportComponent, {
            header: 'تعديل دعم',
            width: '65%',
            modal: true,
            breakpoints: { '1199px': '75vw', '575px': '90vw' },
            focusOnShow: false,
            autoZIndex: true,
            baseZIndex: 10000,
            dismissableMask: false,
            data: {
                id: this.id,
                nationalInitiativeDetailId: this.support?.nationalInitiativeDetailId ?? '',
                rowData: this.support
            }
        });

        this.dialogRef.onClose.subscribe((changed: boolean) => {
            if (changed) {
                this.loadData();
            }
        });
    }

    navigateBack(): void {
        if (this.support?.nationalInitiativeDetailId) {
            this.route.navigate([
                `/pages/national-initiatives/initiative-details/edit/${this.support.nationalInitiativeDetailId}`
            ]);
        } else {
            this.route.navigate(['/pages/national-initiatives/initiative-details']);
        }
    }
}
