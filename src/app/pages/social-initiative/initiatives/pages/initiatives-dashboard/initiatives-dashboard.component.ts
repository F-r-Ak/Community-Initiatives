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
    citiesActivitiesChartData: any;
    chartOptions: any;
    doughnutChartOptions: any;
    barChartOptions: any;
    doughnutPlugins: any[] = [];
    barPlugins: any[] = [];

    activitiesTotalCount: number = 0;
    initiativesTotalCount: number = 0;

    beneficiariesStatistics: any = null;
    totalBeneficiaries: any = null;

    readonly cardColors = ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#EC407A', '#AB47BC'];

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.loadDashboardData();
        this.initChartOptions();
    }

    initChartOptions() {
        // Inline plugin: draw count + percentage inside each doughnut slice
        this.doughnutPlugins = [
            {
                id: 'doughnutInsideLabels',
                afterDraw(chart: any) {
                    const { ctx, data } = chart;
                    const total = (data.datasets[0].data as number[]).reduce((a: number, b: number) => a + b, 0);
                    chart.getDatasetMeta(0).data.forEach((arc: any, i: number) => {
                        const value = data.datasets[0].data[i] as number;
                        if (!value || total === 0) return;
                        const pct = ((value / total) * 100).toFixed(1);
                        const mid = (arc.startAngle + arc.endAngle) / 2;
                        const r = (arc.innerRadius + arc.outerRadius) / 2;
                        const x = arc.x + Math.cos(mid) * r;
                        const y = arc.y + Math.sin(mid) * r;
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#fff';
                        ctx.font = 'bold 15px Cairo, sans-serif';
                        ctx.fillText(`${value}`, x, y - 9);
                        ctx.font = '600 13px Cairo, sans-serif';
                        ctx.fillText(`${pct}%`, x, y + 9);
                        ctx.restore();
                    });
                }
            }
        ];

        // Inline plugin: draw count + percentage on top of each bar
        this.barPlugins = [
            {
                id: 'barTopLabels',
                afterDatasetsDraw(chart: any) {
                    const { ctx, data } = chart;
                    const total = (data.datasets[0].data as number[]).reduce((a: number, b: number) => a + b, 0);
                    chart.getDatasetMeta(0).data.forEach((bar: any, i: number) => {
                        const value = data.datasets[0].data[i] as number;
                        if (value == null) return;
                        const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillStyle = '#333';
                        ctx.font = 'bold 13px Cairo, sans-serif';
                        ctx.fillText(`${value} (${pct}%)`, bar.x, bar.y - 4);
                        ctx.restore();
                    });
                }
            }
        ];

        this.doughnutChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { family: 'Cairo, sans-serif' } }
                }
            }
        };

        this.barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 28 } },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { family: 'Cairo, sans-serif' } }
                }
            }
        };

        this.chartOptions = this.barChartOptions;
    }

    loadDashboardData() {
        forkJoin({
            executionStatus: this.activitiesService.getExecutionStatusDashboardCounts(),
            cities: this.initiativesService.getCitiesDashboardCounts(),
            citiesActivities: this.activitiesService.getCitiesActivitiesDashboardCounts(),
            activitiesTotal: this.activitiesService.getActivitiesTotalCount(),
            initiativesTotal: this.initiativesService.getInitiativesTotalCount(),
            beneficiariesStatistics: this.activitiesService.getBeneficiariesStatistics(),
            totalBeneficiaries: this.activitiesService.getTotalBeneficiaries()
        }).subscribe({
            next: ({ executionStatus, cities, citiesActivities, activitiesTotal, initiativesTotal, beneficiariesStatistics, totalBeneficiaries }) => {
                this.buildExecutionStatusChart(executionStatus);
                this.buildCitiesChart(cities);
                this.activitiesTotalCount = activitiesTotal;
                this.initiativesTotalCount = initiativesTotal;
                this.beneficiariesStatistics = beneficiariesStatistics?.data ?? beneficiariesStatistics;
                this.totalBeneficiaries = totalBeneficiaries?.data ?? totalBeneficiaries;
                this.buildCitiesActivitiesChart(citiesActivities);
            }

        })


    }

    private buildExecutionStatusChart(data: { id: string; name: string; count: number }[]) {
        this.executionStatusChartData = {
            labels: data.map((d) => d.name),
            datasets: [
                {
                    label: 'عدد المبادرات',
                    data: data.map((d) => d.count),
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#EC407A'],
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
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#EC407A'],
                    borderRadius: 6
                }
            ]
        };
         console.log('beneficiariesStatistics:', this.citiesChartData);
    }
   private buildCitiesActivitiesChart(data: { id: string; name: string; count: number }[]) {
        this.citiesActivitiesChartData = {
            labels: data.map((d) => d.name),
            datasets: [
                {
                    label: 'عدد الأنشطة',
                    data: data.map((d) => d.count),
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#EC407A'],
                    borderRadius: 6
                }
            ]
        };
         console.log('beneficiariesStatistics:', this.citiesChartData);
    }
}
