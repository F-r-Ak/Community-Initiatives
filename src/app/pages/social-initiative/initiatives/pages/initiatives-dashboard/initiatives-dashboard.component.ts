import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { PrimeTitleToolBarComponent } from '../../../../../shared/components/primeng/p-title-toolbar/p-title-toolbar.component';
import { InitiativesService } from '../../../../../shared/services/initiatives/initiatives.service';
import { BaseComponent } from '../../../../../base/components/base-component';
import { forkJoin } from 'rxjs';
import { ActivitiesService } from '../../../../../shared';

@Component({
    selector: 'app-initiatives-dashboard',
    standalone: true,
    imports: [CommonModule, ChartModule, CardModule, PrimeTitleToolBarComponent],
    templateUrl: './initiatives-dashboard.component.html',
    styleUrl: './initiatives-dashboard.component.scss'
})
export class InitiativesDashboardComponent extends BaseComponent implements OnInit {
    initiativesService = inject(InitiativesService);
    activitiesService = inject(ActivitiesService);

    executionStatusChartData: any;
    citiesChartData: any;
    chartOptions: any;

    activitiesTotalCount: number = 0;
    initiativesTotalCount: number = 0;

    readonly cardColors = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A', '#26C6DA'];

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.loadDashboardData();
        this.initChartOptions();
    }

    initChartOptions() {
        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { family: 'Cairo, sans-serif' } }
                }
            }
        };
    }

    loadDashboardData() {
        forkJoin({
            executionStatus: this.activitiesService.getExecutionStatusDashboardCounts(),
            cities: this.activitiesService.getCitiesActivitiesDashboardCounts(),
            activitiesTotal: this.activitiesService.getActivitiesTotalCount(),
            initiativesTotal: this.initiativesService.getInitiativesTotalCount()
        }).subscribe({
            next: ({ executionStatus, cities, activitiesTotal, initiativesTotal }) => {
                this.buildExecutionStatusChart(executionStatus);
                this.buildCitiesChart(cities);
                this.activitiesTotalCount = activitiesTotal;
                this.initiativesTotalCount = initiativesTotal;
            }
        });
    }

    private buildExecutionStatusChart(data: { id: string; name: string; count: number }[]) {
        this.executionStatusChartData = {
            labels: data.map((d) => d.name),
            datasets: [
                {
                    label: 'عدد المبادرات',
                    data: data.map((d) => d.count),
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A'],
                    borderRadius: 6
                }
            ]
        };
    }

    private buildCitiesChart(data: { id: string; name: string; count: number }[]) {
        this.citiesChartData = {
            labels: data.map((d) => d.name),
            datasets: [
                {
                    label: 'عدد الأنشطة',
                    data: data.map((d) => d.count),
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A'],
                    borderRadius: 6
                }
            ]
        };
    }
}
