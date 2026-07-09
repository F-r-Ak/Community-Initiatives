import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BaseComponent } from '../../../../../base/components/base-component';
import { InitiativesService, InitiativeTeamsService, ActivitiesService } from '../../../../../shared/services';
import { InitiativeDto, InitiativeTeamDto } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-initiative',
    standalone: true,
    imports: [CommonModule, RouterModule, CardModule, ButtonModule],
    templateUrl: './initiative.component.html',
    styleUrl: './initiative.component.scss'
})
export class InitiativeComponent extends BaseComponent implements OnInit {
    id: string = '';
    initiative: InitiativeDto | null = null;
    teamMembers: InitiativeTeamDto[] = [];
    activities: any[] = [];
    activitiesCount: number = 0;
    outputsCount: number = 0;
    isLoadingTeam: boolean = false;

    showActivities: boolean = true;
    showOutputs: boolean = true;

    initiativesService = inject(InitiativesService);
    teamsService = inject(InitiativeTeamsService);
    activitiesService = inject(ActivitiesService);

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
        this.initiativesService.getInitiative(this.id).subscribe({
            next: (data: any) => {
                this.initiative = data;
            }
        });

        this.teamsService.getPaged({ pageNumber: 1, pageSize: 100, filter: { initiativeId: this.id } }).subscribe({
            next: (res: any) => {
                this.teamMembers = res?.data ?? res ?? [];
            }
        });

        this.activitiesService.getPaged({ pageNumber: 1, pageSize: 100, filter: { initiativeId: this.id } }).subscribe({
            next: (res: any) => {
                this.activities = res?.data ?? res ?? [];
                this.activitiesCount = res?.totalCount ?? this.activities.length;
            }
        });
    }

    get manager(): InitiativeTeamDto | undefined {
        return this.teamMembers.find(m => m.teamCategory === 'Manager' || m.teamCategoryNameAr?.includes('مسئول'));
    }

    get regularMembers(): InitiativeTeamDto[] {
        return this.teamMembers.filter(m => m !== this.manager);
    }

    getMemberInitial(name: string): string {
        return name?.trim()?.[0] ?? '؟';
    }

    navigateToEdit(): void {
        this.route.navigate([`/pages/social-initiatives/initiatives/edit/${this.id}`]);
    }

    navigateBack(): void {
        this.route.navigate(['/pages/social-initiatives/initiatives']);
    }

    confirmDelete(): void {
        this.initiativesService.remove(this.id).subscribe(() => {
            this.navigateBack();
        });
    }

    toggleActivities(): void {
        this.showActivities = !this.showActivities;
    }

    toggleOutputs(): void {
        this.showOutputs = !this.showOutputs;
    }
}
