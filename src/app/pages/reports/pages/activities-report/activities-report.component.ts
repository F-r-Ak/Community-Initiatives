import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { Observable, of } from 'rxjs';
import { ActivitiesService, ActivityReportFilter } from '../../../../shared/services/activities/activities.service';
import { CitiesService } from '../../../../shared/services/settings/cities/cities.service';
import { PrimeAutoCompleteComponent, PrimeDatepickerComponent, PrimeTitleToolBarComponent } from '../../../../shared';
import { FileSaverService } from 'ngx-filesaver';

@Component({
    selector: 'app-activities-report',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CardModule, PrimeTitleToolBarComponent, PrimeAutoCompleteComponent, PrimeDatepickerComponent],
    templateUrl: './activities-report.component.html',
    styleUrl: './activities-report.component.scss'
})
export class ActivitiesReportComponent implements OnInit {
    filterForm!: FormGroup;
    selectedCity: any = null;
    selectedActivity: any = null;
    selectedReportType: any = null;
    isLoading = false;

    reportTypes = [
        { id: 'pdf', name: 'PDF' },
        { id: 'excel', name: 'Excel' }
    ];

    private fb = inject(FormBuilder);
    private activitiesService = inject(ActivitiesService);
    private citiesService = inject(CitiesService);
    private fileSaver = inject(FileSaverService);

    citiesGetMethod = (body: any) => this.citiesService.getDropDown(body);
    activitiesGetMethod = (body: any) => this.activitiesService.getDropDown(body);
    reportTypesGetMethod = (body: any): Observable<any> => {
        const query = body?.filter?.searchCriteria?.toLowerCase() ?? '';
        const filtered = this.reportTypes.filter((r) => r.name.toLowerCase().includes(query));
        return of({ data: filtered, totalCount: filtered.length });
    };

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.filterForm = this.fb.group({
            Name: [null],
            CityId: [null],
            ReportType: [null],
            ActivityStartDate: [null],
            ActivityEndDate: [null]
        });
    }

    onCitySelect(event: any): void {
        this.selectedCity = event?.value ?? null;
        this.filterForm.patchValue({ CityId: this.selectedCity?.id ?? null });
    }

    onCityClear(): void {
        this.selectedCity = null;
        this.filterForm.patchValue({ CityId: null });
    }

    onReportTypeSelect(event: any): void {
        this.selectedReportType = event?.value ?? null;
        this.filterForm.patchValue({ ReportType: this.selectedReportType?.id ?? null });
    }

    onReportTypeClear(): void {
        this.selectedReportType = null;
        this.filterForm.patchValue({ ReportType: null });
    }

    onActivitySelect(event: any): void {
        this.selectedActivity = event?.value ?? null;
        this.filterForm.patchValue({ Name: this.selectedActivity?.name ?? null });
    }

    onActivityClear(): void {
        this.selectedActivity = null;
        this.filterForm.patchValue({ Name: null });
    }

    getReport(): void {
        const raw = this.filterForm.value;
        const reportType: 'pdf' | 'excel' = raw.ReportType ?? 'pdf ';
        const filter: ActivityReportFilter = {
            ReportName: 'ActivityReport',
            ReportType: reportType,
            Name: raw.Name || undefined,
            CityId: raw.CityId || undefined,
            ActivityStartDate: raw.ActivityStartDate ? this.formatDate(raw.ActivityStartDate) : undefined,
            ActivityEndDate: raw.ActivityEndDate ? this.formatDate(raw.ActivityEndDate) : undefined
        };

        this.isLoading = true;
        this.activitiesService.getReport(filter).subscribe({
            next: (blob: Blob) => {
                const ext = reportType === 'pdf' ? 'pdf' : 'xls';
                this.fileSaver.save(blob, `ActivityReport.${ext}`);
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    printReport(): void {
        const raw = this.filterForm.value;
        const filter: ActivityReportFilter = {
            ReportName: 'ActivityReport',
            ReportType: raw.ReportType ?? 'pdf',
            Name: raw.Name || undefined,
            CityId: raw.CityId || undefined,
            ActivityStartDate: raw.ActivityStartDate ? this.formatDate(raw.ActivityStartDate) : undefined,
            ActivityEndDate: raw.ActivityEndDate ? this.formatDate(raw.ActivityEndDate) : undefined
        };

        this.isLoading = true;
        this.activitiesService.getReport(filter).subscribe({
            next: (blob: Blob) => {
                const url = URL.createObjectURL(blob);
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = url;
                document.body.appendChild(iframe);
                iframe.onload = () => {
                    iframe.contentWindow?.print();
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                        URL.revokeObjectURL(url);
                    }, 1000);
                };
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    resetForm(): void {
        this.filterForm.reset();
        this.selectedCity = null;
        this.selectedActivity = null;
        this.selectedReportType = null;
    }

    private formatDate(date: Date): string {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
