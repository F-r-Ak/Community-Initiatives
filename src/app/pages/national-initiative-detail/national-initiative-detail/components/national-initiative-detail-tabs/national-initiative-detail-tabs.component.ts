import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { BaseComponent } from '../../../../../base/components/base-component';
import { nationalInitiativeDetailTabs } from '../../../../../core/enums/national-initiative-detail-tabs';
import { AddEditNationalInitiativeDetailComponent } from '../add-edit-national-initiative-detail/add-edit-national-initiative-detail.component';
import { ServiceBeneficiariesComponent } from '../service-beneficiaries/service-beneficiaries.component';
import { ServiceDevelopmentEntitiesComponent } from '../service-developmentEntities/service-developmentEntities.component';
import { DevelopServiceAgesComponent } from '../develop-service-ages/develop-service-ages.component';
import { ServiceDetailsComponent } from '../service-details/service-details.component'
@Component({
    selector: 'app-national-initiative-detail-tabs',
    standalone: true,
    imports: [
        CommonModule,
        TabsModule,
        CardModule,
        AddEditNationalInitiativeDetailComponent,
        ServiceBeneficiariesComponent,
        ServiceDevelopmentEntitiesComponent,
        ServiceDetailsComponent,
        DevelopServiceAgesComponent
        
    ],
    templateUrl: './national-initiative-detail-tabs.component.html',
    styleUrl: './national-initiative-detail-tabs.component.scss'
})
export class NationalInitiativeDetailTabsComponent extends BaseComponent implements OnInit {
  nationalInitiativeDetailTabs = nationalInitiativeDetailTabs;
    activeTab: string = nationalInitiativeDetailTabs.Main;
    nationalInitiativeId: string = '';
    hasActivities: boolean = false;

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.nationalInitiativeId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    }

    get isEditMode(): boolean {
        return !!this.nationalInitiativeId;
    }

    onActivitiesCountChange(count: number): void {
        this.hasActivities = count > 0;
    }
}
