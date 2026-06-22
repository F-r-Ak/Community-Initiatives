import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import {
    SubmitButtonsComponent,
    PrimeInputTextComponent,
    PrimeDatepickerComponent,
    PrimeAutoCompleteComponent,
    TeamMembersService,
    GendersService,
    JobStatusService,
    TeamCategoriesService
} from '../../../../../shared';
import { EnumDto } from '../../../../../shared/interfaces';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';

@Component({
    selector: 'app-add-edit-team-member',
    standalone: true,
    imports: [
        CardModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SubmitButtonsComponent,
        PrimeInputTextComponent,
        PrimeDatepickerComponent,
        PrimeAutoCompleteComponent
    ],
    templateUrl: './add-edit-team-member.component.html',
    styleUrl: './add-edit-team-member.component.scss'
})
export class AddEditTeamMemberComponent extends BaseEditComponent implements OnInit {
    teamMembersService: TeamMembersService = inject(TeamMembersService);
    gendersService: GendersService = inject(GendersService);
    jobStatusService: JobStatusService = inject(JobStatusService);
    teamCategoriesService: TeamCategoriesService = inject(TeamCategoriesService);
    dialogService: DialogService = inject(DialogService);

    genders: EnumDto[] = [];
    selectedGender: any;
    filteredGenders: EnumDto[] = [];
    jobStatuses: EnumDto[] = [];
    selectedJobStatus: any;
    filteredJobStatuses: EnumDto[] = [];
    teamCategories: EnumDto[] = [];
    selectedTeamCategory: any;
    filteredTeamCategories: EnumDto[] = [];

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'edit') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        this.loadEnums();
    }

    loadEnums() {
        forkJoin({
            genders: this.gendersService.genders,
            jobStatuses: this.jobStatusService.jobStatus,
            teamCategories: this.teamCategoriesService.teamCategories
        }).subscribe({
            next: ({ genders, jobStatuses, teamCategories }) => {
                this.genders = genders;
                this.jobStatuses = jobStatuses;
                this.teamCategories = teamCategories;
                if (this.pageType === 'edit') {
                    this.getEditTeamMember();
                } else {
                    this.initFormGroup();
                }
            },
            error: () => {
                this.alert.error('خطأ فى جلب البيانات');
            }
        });
    }

    getGenders(event: any) {
        const query = event.query.toLowerCase();
        this.gendersService.genders.subscribe({
            next: (res) => {
                this.filteredGenders = res.filter((gender: any) => gender.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات النوع');
            }
        });
    }

    getJobStatuses(event: any) {
        const query = event.query.toLowerCase();
        this.jobStatusService.jobStatus.subscribe({
            next: (res) => {
                this.filteredJobStatuses = res.filter((jobStatus: any) => jobStatus.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات الحالة الوظيفية');
            }
        });
    }

    getTeamCategories(event: any) {
        const query = event.query.toLowerCase();
        this.teamCategoriesService.teamCategories.subscribe({
            next: (res) => {
                this.filteredTeamCategories = res.filter((teamCategory: any) => teamCategory.nameAr.toLowerCase().includes(query));
            },
            error: (err) => {
                this.alert.error('خطأ فى جلب بيانات فئة العضوية');
            }
        });
    }

    initFormGroup() {
        this.form = this.fb.group({
            id: [null],
            nameAr: ['', Validators.required],
            code: [''],
            gender: [null, Validators.required],
            address: [''],
            mobile: ['', Validators.required],
            email: ['', [Validators.email]],
            nationalID: [''],
            birthDate: [null],
            specailization: [''],
            jobStatus: [null, Validators.required],
            teamCategory: [null, Validators.required]
        });
    }

    getEditTeamMember = () => {
        this.teamMembersService.getEditTeamMember(this.id).subscribe((teamMember: any) => {
            this.initFormGroup();
            this.selectedGender = this.genders.find((g) => g.code === teamMember.gender) ?? null;
            this.selectedJobStatus = this.jobStatuses.find((j) => j.code === teamMember.jobStatus) ?? null;
            this.selectedTeamCategory = this.teamCategories.find((t) => t.code === teamMember.teamCategory) ?? null;
            this.form.patchValue({
                ...teamMember,
                gender: this.selectedGender,
                jobStatus: this.selectedJobStatus,
                teamCategory: this.selectedTeamCategory
            });
        });
    };

    onGenderSelect(event: any) {
        this.selectedGender = event.value;
        this.form.get('gender')?.setValue(this.selectedGender);
    }

    onTeamCategorySelect(event: any) {
        this.selectedTeamCategory = event.value;
        this.form.get('teamCategory')?.setValue(this.selectedTeamCategory);
    }

    onJobStatusSelect(event: any) {
        this.selectedJobStatus = event.value;
        this.form.get('jobStatus')?.setValue(this.selectedJobStatus);
    }

    private toDateOnly(value: any): string | null {
        if (!value) return null;
        const d = new Date(value);
        if (isNaN(d.getTime())) return null;
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    submit() {
        const value = {
            ...this.form.value,
            gender: this.form.value.gender?.code ?? null,
            jobStatus: this.form.value.jobStatus?.code ?? null,
            teamCategory: this.form.value.teamCategory?.code ?? null,
            birthDate: this.toDateOnly(this.form.value.birthDate)
        };
        if (this.pageType === 'add')
            this.teamMembersService.add(value).subscribe(() => {
                this.closeDialog();
            });
        if (this.pageType === 'edit')
            this.teamMembersService.update({ id: this.id, ...value }).subscribe(() => {
                this.closeDialog();
            });
    }

    override redirect() {
        if (this.dialogService.dialogComponentRefMap.size > 0) {
            this.closeDialog();
        } else {
            const currentRoute = this.route.url;
            const index = currentRoute.lastIndexOf('/');
            const str = currentRoute.substring(0, index);
            this.route.navigate([str]);
        }
    }

    closeDialog() {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
