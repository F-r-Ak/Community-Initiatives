import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../../base/components/base-component';
import { NationalInitiativesService, NationalEntitiesService, NationalSupportsService } from '../../../../../shared';
import { NationalInitiativeDto, NationalEntityDto, NationalSupportDto } from '../../../../../shared';

@Component({
    selector: 'app-national-initiative',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './national-initiative.component.html',
    styleUrl: './national-initiative.component.scss'
})
export class NationalInitiativeComponent extends BaseComponent implements OnInit {
    id: string = '';
    nationalInitiative: NationalInitiativeDto | null = null;
    entities: NationalEntityDto[] = [];
    supports: NationalSupportDto[] = [];

    /** counts fetched from paged endpoints */
    beneficiariesCount: number = 0;
    entitiesCount: number = 0;
    supportsCount: number = 0;

    isLoading: boolean = true;

    nationalInitiativesService = inject(NationalInitiativesService);
    nationalEntitiesService = inject(NationalEntitiesService);
    nationalSupportsService = inject(NationalSupportsService);

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

        // Load the main national initiative record
        this.nationalInitiativesService.getNationalInitiative(this.id).subscribe({
            next: (data: any) => {
                this.nationalInitiative = data?.nationalInitiativeDetail ?? data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });

        // Load related entities count
        this.nationalEntitiesService.getPaged({
            pageNumber: 1,
            pageSize: 100,
            filter: { nationalInitiativeDetailId: this.id }
        }).subscribe({
            next: (res: any) => {
                this.entities = res?.data ?? res ?? [];
                this.entitiesCount = res?.totalCount ?? this.entities.length;
            }
        });

        // Load related supports count
        this.nationalSupportsService.getPaged({
            pageNumber: 1,
            pageSize: 100,
            filter: { nationalInitiativeDetailId: this.id }
        }).subscribe({
            next: (res: any) => {
                this.supports = res?.data ?? res ?? [];
                this.supportsCount = res?.totalCount ?? this.supports.length;
            }
        });
    }

    navigateToEdit(): void {
        this.route.navigate([`/pages/national-initiatives/initiative-details/edit/${this.id}`]);
    }

    navigateBack(): void {
        this.route.navigate(['/pages/national-initiatives/initiative-details']);
    }
}
