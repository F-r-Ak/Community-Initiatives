import { Component, inject , OnInit  } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule , Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from './../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent,FieldsService,InitiativesService,TeamMembersService, CitiesService,PrimeAutoCompleteComponent, PrimeInputTextComponent ,PrimeDatepickerComponent,GendersService} from './../../../../shared';
import { ButtonModule } from 'primeng/button';
import { AuthHelper , AlertService,} from './../../../../core';
import { take } from 'rxjs/operators';
import { animate } from '@angular/animations';
@Component({
    selector: 'app-reports',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent , PrimeAutoCompleteComponent, PrimeDatepickerComponent,PrimeInputTextComponent ,ButtonModule,],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
    form!: FormGroup;
    formBuilder = inject(FormBuilder);
    fieldService = inject(FieldsService);
    gendersService = inject(GendersService);
   initiativesService = inject(InitiativesService);
    citiesService = inject(CitiesService);
    teamMembersService = inject(TeamMembersService);
  
    // employeeService = inject(EmployeeService);
    // organizationsService = inject(OrganizationsService);
    // visitCasesService = inject(VisitCasesService);
    alert = inject(AlertService);
    authHelper = inject(AuthHelper);

    filteredfeild: any[] = [];
    filteredInitiativeMangerName: any[] = [];
    filteredCity: any[] = [];
    filteredRequestStatus: any[] = [];
    filteredServiceType: any[] = [];
    filteredname: any[] = [];

    reportTypes: any[] = [];
    acceptLanguages: any[] = [];
    isGeneratingReport: boolean = false;

    ngOnInit(): void {
        this.initFormGroup();
        this.initDropdowns();
    }

    initFormGroup() {
        this.form = this.formBuilder.group({
           fieldNameId :[''], 
            cityId: [''],   
            name: [''], 
            initiativeMangerName: [''],
            initiativeDate :[null],
            reportName: ['InitiativeReport', [Validators.required, Validators.minLength(1)]],
            reportType: ['pdf', [Validators.required]],
            acceptLanguage: ['ar', [Validators.required]]
        });
    }

    initDropdowns() {
        this.reportTypes = [
            { label: 'PDF', value: 'pdf' },
            { label: 'Excel', value: 'excel' }
        ];
    }

   searchName(event: any) {
        const query = event.query?.toLowerCase() ?? '';
        this.initiativesService.initiatives.pipe(take(1)).subscribe((res: any[]) => {
            this.filteredname = res.filter((item: any) => item.name?.toLowerCase().includes(query));
        });
       
    }
onNameSelect(event: any) {
    this.form.patchValue({
        name: event.value?.name // يخزن Male أو Female مباشرة
    });
} 

onInitiativeMangerSelect(event: any) {
    this.form.patchValue({
        initiativeMangerName: event.value?.nameAr // يخزن Male أو Female مباشرة
    });
} 
searchInitiativeMangerName(event: any) {
        const query = event.query?.toLowerCase() ?? '';
        this.teamMembersService.teamMembers.pipe(take(1)).subscribe((res: any[]) => {
            this.filteredInitiativeMangerName = res.filter((item: any) => item.nameAr?.toLowerCase().includes(query));
        });
    }
    searchField(event: any) {
        const query = event.query?.toLowerCase() ?? '';
        this.fieldService.fields.pipe(take(1)).subscribe((res: any[]) => {
            this.filteredfeild = res.filter((item: any) => item.nameAr?.toLowerCase().includes(query));
        });
    }

onFieldSelect(event: any) {
    this.form.patchValue({
        fieldNameId: event.value?.nameEn // يخزن Male أو Female مباشرة
    });
} 

onCitySelect(event: any) {
    this.form.patchValue({
        cityId: event.value?.nameEn // يخزن اسم المدينة باللغة الإنجليزية مباشرة
    });
}
onRequestStatusSelect(event: any) {
    this.form.patchValue({
        requestStatusId: event.value?.nameEn // يخزن اسم الحالة باللغة الإنجليزية مباشرة
    });
}
onServiceTypeSelect(event: any) {
    this.form.patchValue({
        serviceTypeId: event.value?.nameEn // يخزن اسم نوع الخدمة باللغة الإنجليزية مباشرة
    });
}
onReportTypeSelect(event: any) {
    // للتأكد من أخذ قيمة النص الصافي سواء كان الـ event هو الأوبجكت نفسه أو بداخل قيمة value
    const selectedValue = event.value?.value || event.value || event;
    
    this.form.get('reportType')?.setValue(selectedValue);
    this.form.get('reportType')?.updateValueAndValidity();
}
    // searchMaritalStatus(event: any) {
    //     const query = event.query?.toLowerCase() ?? '';
    //     this.maritalStatusesService.maritalStatuses.pipe(take(1)).subscribe((res: any[]) => {
    //         this.filteredMaritalStatus = res.filter((item: any) => item.nameAr?.toLowerCase().includes(query));
    //     });
    // }
    searchCity(event: any) {
        const query = event.query?.toLowerCase() ?? '';
        this.citiesService.cities.pipe(take(1)).subscribe((res: any[]) => {
            this.filteredCity = res.filter((item: any) => item.nameAr?.toLowerCase().includes(query));
        });
    }
   



    searchReportTypes(event: any) {
        const query = event.query.toLowerCase();
        this.reportTypes = [
            { label: 'PDF', value: 'pdf' },
            { label: 'Excel', value: 'excel' }
        ].filter(item => item.label.toLowerCase().includes(query));
    }

    onExecute() {
        // Validate that at least ServiceNameId or NationalId is provided
        // if (!this.form.get('ServiceNameId')?.value ) {
        //     this.alert.error('يرجى إدخال معرّف الشخص أو الرقم القومي');
        //     return;
        // }

        if (this.form.valid) {
            this.isGeneratingReport = true;
            const formData = this.form.value;

            // Clean up the form data - remove empty values
            const cleanedData = this.cleanFormData(formData);

            // Log detailed request information for debugging
            console.log('=== Report Generation Request ===');
            console.log('Form Data:', formData);
            console.log('Cleaned Data:', cleanedData);
         
            console.log('Query Parameters:', this.buildQueryParamsDebug(cleanedData));
            console.log('=================================');

            // Since the API returns the file directly, use downloadReport
           this.initiativesService.downloadReport(cleanedData).subscribe({
    next: (blob: Blob) => {
        this.isGeneratingReport = false;

        let fileExtension = 'pdf';
        let mimeType = 'application/pdf';

        if (cleanedData.reportType === 'excel') {
            
            fileExtension = 'xls'; 
            mimeType = 'application/vnd.ms-excel'; 
        }

        // إنشاء الـ Blob بالنوع المتوافق تماماً مع السيرفر
        const reportBlob = new Blob([blob], { type: mimeType });

        const fileName = `${cleanedData.reportName}.${fileExtension}`;
        const url = window.URL.createObjectURL(reportBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
        this.alert.success('تم تحميل التقرير بنجاح');
    },
    error: (error: any) => {
        this.isGeneratingReport = false;
        this.alert.error('حدث خطأ أثناء تحميل الملف');
    
                }
            });
        } else {
            this.alert.error('يرجى التأكد من صحة البيانات المدخلة');
            this.markFormGroupTouched();
        }
    }

    private buildQueryParamsDebug(body: any): any {
        const params: any = {};
        if (body.reportName) params.ReportName = body.reportName;
        if (body.reportType) params.ReportType = body.reportType;
        if (body.acceptLanguage) params.AcceptLanguage = body.acceptLanguage;
        // if (body.ServiceNameId) params.ServiceNameId = body.ServiceNameId;
      
        return params;
    }

    private cleanFormData(formData: any): any {
        const cleaned: any = {};

        // Only include non-empty values
        Object.keys(formData).forEach(key => {
            const value = formData[key];
            if (value !== null && value !== undefined && value !== '') {
                cleaned[key] = value;
            }
        });

        // Ensure required fields have default values
        if (!cleaned.reportName) {
            cleaned.reportName = 'InitiativeReport';
        }
      
if (cleaned.reportType) {
    cleaned.reportType = typeof cleaned.reportType === 'object' ? cleaned.reportType.value : cleaned.reportType;
}
        if (!cleaned.acceptLanguage) {
            cleaned.acceptLanguage = 'ar';
        }

        return cleaned;
    }

    private markFormGroupTouched(): void {
        Object.keys(this.form.controls).forEach(key => {
            const control = this.form.get(key);
            if (control) {
                control.markAsTouched();
            }
        });
    }

    onClear() {
         this.isGeneratingReport = false;
        this.form.reset();

        // Reset to default values
        this.form.patchValue({
            reportName: 'InitiativeReport',
            reportType: 'pdf',
            acceptLanguage: 'ar'
        });
        // Clear filtered arrays
        this.filteredCity = [];
       
        this.filteredInitiativeMangerName= [];
        this.filteredRequestStatus = [];
        this.filteredfeild = [];
        this.filteredServiceType = [];  
    }
}
