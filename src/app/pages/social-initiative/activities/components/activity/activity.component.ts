import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseComponent } from '../../../../../base/components/base-component';
import { ActivitiesService, ActivityBeneficiaryGroupsService } from '../../../../../shared/services';
import { ActivityDto } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-activity',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './activity.component.html',
    styleUrl: './activity.component.scss'
})
export class ActivityComponent extends BaseComponent implements OnInit {
    id: string = '';
    activity: ActivityDto | null = null;
    beneficiaryGroups: any[] = [];

    activitiesService = inject(ActivitiesService);
    beneficiaryGroupsService = inject(ActivityBeneficiaryGroupsService);

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
        this.activitiesService.getActivity(this.id).subscribe({
            next: (data: any) => {
                this.activity = data;
            }
        });

        this.beneficiaryGroupsService.getPaged({ pageNumber: 1, pageSize: 100, filter: { activityId: this.id } }).subscribe({
            next: (res: any) => {
                this.beneficiaryGroups = res?.data ?? res ?? [];
            }
        });
    }

    getFileIcon(fileName: string): string {
        const ext = fileName?.split('.').pop()?.toLowerCase() ?? '';
        if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'].includes(ext)) return 'pi pi-image text-info';
        if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) return 'pi pi-video text-warning';
        if (ext === 'pdf') return 'pi pi-file-pdf text-danger';
        if (['doc', 'docx'].includes(ext)) return 'pi pi-file-word text-primary';
        if (['xls', 'xlsx'].includes(ext)) return 'pi pi-file-excel text-success';
        return 'pi pi-file text-secondary';
    }

    navigateToEdit(): void {
        this.route.navigate([`/pages/social-initiatives/activities/edit/${this.id}`]);
    }

    navigateBack(): void {
        this.route.navigate(['/pages/social-initiatives/activities']);
    }
}
