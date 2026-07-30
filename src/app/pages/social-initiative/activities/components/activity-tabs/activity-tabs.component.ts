import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { BaseComponent } from '../../../../../base/components/base-component';
import { ActivityTabs } from '../../../../../core/enums/activity-tabs';
import { AddEditActivityComponent } from '../add-edit-activity/add-edit-activity.component';
import { ActivityBeneficiaryGroupsComponent } from '../activity-beneficiary-groups/activity-beneficiary-groups.component';
import { ActivityEntitiesComponent } from '../activity-entities/activity-entities.component';

@Component({
    selector: 'app-activity-tabs',
    standalone: true,
    imports: [CommonModule, TabsModule, AddEditActivityComponent, ActivityBeneficiaryGroupsComponent, ActivityEntitiesComponent],
    templateUrl: './activity-tabs.component.html',
    styleUrl: './activity-tabs.component.scss'
})
export class ActivityTabsComponent extends BaseComponent implements OnInit {
    ActivityTabs = ActivityTabs;
    activeTab: string = ActivityTabs.Main;
    activityId: string = '';

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.activityId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    }

    get isEditMode(): boolean {
        return !!this.activityId;
    }
}
