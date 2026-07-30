import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { AddEditActivityComponent } from '../add-edit-activity/add-edit-activity.component';
import { ActivityBeneficiaryGroupsComponent } from '../activity-beneficiary-groups/activity-beneficiary-groups.component';
import { ActivityEntitiesComponent } from '../activity-entities/activity-entities.component';

@Component({
    selector: 'app-activity-tabs',
    standalone: true,
    imports: [CommonModule, TabViewModule, AddEditActivityComponent, ActivityBeneficiaryGroupsComponent, ActivityEntitiesComponent],
    templateUrl: './activity-tabs.component.html',
    styleUrl: './activity-tabs.component.scss'
})
export class ActivityTabsComponent implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    cdr = inject(ChangeDetectorRef);

    activityId: string | null = null;
    pageType: string = 'add';
    activeTabIndex: number = 0;

    ngOnInit(): void {
        this.activityId = this.activatedRoute.snapshot.params['id'] ?? null;
        this.pageType = this.activatedRoute.snapshot.data['pageType'] ?? 'add';
        this.activeTabIndex = 0;
    }

    onTabChange(event: any): void {
        this.activeTabIndex = event.index;
    }

    get isEditMode(): boolean {
        return !!this.activityId;
    }
}
