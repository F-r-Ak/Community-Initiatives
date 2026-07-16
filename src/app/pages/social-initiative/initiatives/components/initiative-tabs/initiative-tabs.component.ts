import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { BaseComponent } from '../../../../../base/components/base-component';
import { InitiativeTabs } from '../../../../../core/enums/initiative-tabs';
import { AddEditInitiativeComponent } from '../add-edit-initiative/add-edit-initiative.component';
import { ActivitiesComponent } from '../activities/activities.component';
import { InitiativeTeamsComponent } from '../initiative-teams/initiative-teams.component';
import { MediaInitiativesComponent } from '../mediainitiative/mediainitiatives.component';
@Component({
    selector: 'app-initiative-tabs',
    standalone: true,
    imports: [
        CommonModule,
        TabsModule,
        CardModule,
        AddEditInitiativeComponent,
        ActivitiesComponent,
        InitiativeTeamsComponent,
        MediaInitiativesComponent,
    ],
    templateUrl: './initiative-tabs.component.html',
    styleUrl: './initiative-tabs.component.scss'
})
export class InitiativeTabsComponent extends BaseComponent implements OnInit {
    InitiativeTabs = InitiativeTabs;
    activeTab: string = InitiativeTabs.Main;
    initiativeId: string = '';
    hasActivities: boolean = false;

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initiativeId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    }

    get isEditMode(): boolean {
        return !!this.initiativeId;
    }

    onActivitiesCountChange(count: number): void {
        this.hasActivities = count > 0;
    }
}
