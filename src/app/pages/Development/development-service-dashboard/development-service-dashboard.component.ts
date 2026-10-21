import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { PrimeTitleToolBarComponent } from './../../../shared/components/primeng/p-title-toolbar/p-title-toolbar.component';
import { BaseComponent } from './../../../base/components/base-component';
import { forkJoin } from 'rxjs';
import { DevelopmentServiceService } from './../../../shared';

interface DashboardCount {
    id: string;
    name: string;
    count: number;
}

@Component({
    selector: 'app-development-service-dashboard',
    standalone: true,
    imports: [CommonModule, ChartModule, CardModule, PrimeTitleToolBarComponent],
    templateUrl: './development-service-dashboard.component.html',
    styleUrl: './development-service-dashboard.component.scss'
})
export class DevelopmentServiceDashboardComponent extends BaseComponent implements OnInit {
    developmentServiceService = inject(DevelopmentServiceService);

    governoratesChartData: any;
    chartOptions: any;
    totalServicesCount = 0;
    totalBeneficiariesCount = 0;

    readonly cardColors = ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#EC407A', '#AB47BC'];

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initChartOptions();
        this.loadDashboardData();
    }

    private initChartOptions(): void {
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

    private loadDashboardData(): void {
        forkJoin({
            governorates: this.developmentServiceService.getCitiesDashboardCounts(),
            beneficiaries: this.developmentServiceService.getcountbybeneficiary()
        }).subscribe({
            next: ({ governorates, beneficiaries }) => {
                this.governoratesChartData = this.buildChartData(governorates, 'عدد الخدمات');
                this.totalServicesCount = governorates.reduce(
                    (total: number, item: DashboardCount) => total + Number(item.count),
                    0
                );
                this.totalBeneficiariesCount = beneficiaries.reduce(
                    (total: number, item: DashboardCount) => total + Number(item.count),
                    0
                );
            },
            error: () => this.alert.error('حدث خطأ أثناء تحميل إحصائيات الخدمات التنموية')
        });
    }

    private buildChartData(data: DashboardCount[], label: string) {
        return {
            labels: data.map((item) => item.name),
            datasets: [
                {
                    label,
                    data: data.map((item) => item.count),
                    backgroundColor: this.cardColors,
                    borderRadius: 6
                }
            ]
        };
    }

      private buildCitiesChart(data: { id: string; name: string; count: number }[]) {
        this.governoratesChartData = {
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
         console.log('beneficiariesStatistics:', this.governoratesChartData);
    }
   private buildCitiesActivitiesChart(data: { id: string; name: string; count: number }[]) {
        this.governoratesChartData = {
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
         console.log('beneficiariesStatistics:', this.governoratesChartData);
    }
}
