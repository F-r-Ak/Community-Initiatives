import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from '../../../../../base/components/base-component';
import { NationalEntitiesService } from '../../../../../shared';
import { NationalEntityDto } from '../../../../../shared';
import { AddEditNationalEntityComponent } from '../add-edit-national-entity/add-edit-national-entity.component';
import { EntityTypes } from '../../../../../core/enums/entity-types';

@Component({
    selector: 'app-national-entity',
    standalone: true,
    imports: [CommonModule, RouterModule],
    providers: [DialogService],
    templateUrl: './national-entity.component.html',
    styleUrl: './national-entity.component.scss'
})
export class NationalEntityComponent extends BaseComponent implements OnInit {
    id: string = '';
    entity: NationalEntityDto | null = null;
    isLoading: boolean = true;

    readonly EntityTypes = EntityTypes;

    nationalEntitiesService = inject(NationalEntitiesService);
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
        this.nationalEntitiesService.getNationalEntity(this.id).subscribe({
            next: (data: any) => {
                this.entity = data?.data ?? data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    /** Resolved display name: entity-backed types use entityName, Organization uses vw_OrganizationName. */
    get displayName(): string {
        return this.entity?.nationalInitiativeName || '—';
    }

    openEditDialog(): void {
        this.dialogRef = this.dialogService.open(AddEditNationalEntityComponent, {
            header: 'تعديل جهة منفذة',
            width: '65%',
            modal: true,
            breakpoints: { '1199px': '75vw', '575px': '90vw' },
            focusOnShow: false,
            autoZIndex: true,
            baseZIndex: 10000,
            dismissableMask: false,
            data: {
                id: this.id,
                nationalInitiativeDetailId: this.entity?.nationalInitiativeDetailId ?? '',
                rowData: this.entity
            }
        });

        this.dialogRef.onClose.subscribe((changed: boolean) => {
            if (changed) {
                this.loadData();
            }
        });
    }

    navigateBack(): void {
        if (this.entity?.nationalInitiativeDetailId) {
            this.route.navigate([
                `/pages/national-initiatives/initiative-details/edit/${this.entity.nationalInitiativeDetailId}`
            ]);
        } else {
            this.route.navigate(['/pages/national-initiatives/initiative-details']);
        }
    }
}
