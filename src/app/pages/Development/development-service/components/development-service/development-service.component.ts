import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BaseComponent } from '../../../../../base/components/base-component';
import { InitiativesService, InitiativeTeamsService, ActivitiesService , DevelopmentServiceService , ServiceBeneficiariesService , ServiceDevelopmentEntitiesService} from '../../../../../shared/services';
import { InitiativeDto, InitiativeTeamDto , DevelopmentServiceDto} from '../../../../../shared/interfaces';

@Component({
    selector: 'app-development-service',
    standalone: true,
    imports: [CommonModule, RouterModule, CardModule, ButtonModule],
    templateUrl: './development-service.component.html',
    styleUrl: './development-service.component.scss'
})
export class DevelopmentServiceComponent extends BaseComponent implements OnInit {
    id: string = '';
    developmentService: DevelopmentServiceDto | null = null;
   
    activities: any[] = [];
    activitiesCount: number = 0;
    outputsCount: number = 0;
    servicedevelopmententities: any[] = [];
    servicebeneficiaries: any[] = [];
    
    showActivities: boolean = true;
    showOutputs: boolean = true;
    
    initiativesService = inject(InitiativesService);
    teamsService = inject(InitiativeTeamsService);
    activitiesService = inject(ActivitiesService);
    developmentServicesService = inject(DevelopmentServiceService);
    serviceBeneficiariesService = inject(ServiceBeneficiariesService);
    serviceDevelopmentEntitiesService = inject(ServiceDevelopmentEntitiesService);

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
        this.developmentServicesService.getDevelopmentService(this.id).subscribe({
            next: (data: any) => {
                this.developmentService = data;
            }
        });

       

        this.developmentServicesService.getPaged({ pageNumber: 1, pageSize: 100, filter: { developmentServiceId: this.id } }).subscribe({
            next: (res: any) => {
                this.activities = res?.data ?? res ?? [];
                this.activitiesCount = res?.totalCount ?? this.activities.length;
            }
        });
         this.serviceBeneficiariesService.getPaged({ pageNumber: 1, pageSize: 100, filter: { developmentServiceId: this.id } }).subscribe({
            next: (res: any) => {
                this.servicebeneficiaries = res?.data ?? res ?? [];
                console.log('servicebeneficiaries', this.servicebeneficiaries);
            }
        });

        this.serviceDevelopmentEntitiesService.getPaged({ pageNumber: 1, pageSize: 100, filter: { developmentServiceId: this.id } }).subscribe({
            next: (res: any) => {
                this.servicedevelopmententities = res?.data ?? res ?? [];
                console.log('servicedevelopmententities', this.servicedevelopmententities);
            }
        });
    }

   
   

    getMemberInitial(name: string): string {
        return name?.trim()?.[0] ?? '؟';
    }

    navigateToEdit(): void {
        this.route.navigate([`/pages/develpment-initiatives/development-service/edit/${this.id}`]);
    }

    navigateBack(): void {
        this.route.navigate(['/pages/develpment-initiatives/development-service']);
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
