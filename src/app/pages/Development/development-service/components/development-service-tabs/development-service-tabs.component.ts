import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { BaseComponent } from '../../../../../base/components/base-component';
import { ServiceDevelopmentEntityTabs } from '../../../../../core/enums/service-developmententity-tabs';
import { AddEditDevelopmentServiceComponent } from '../add-edit-development-service/add-edit-development-service.component';
import { ServiceBeneficiariesComponent } from '../service-beneficiaries/service-beneficiaries.component';
import { ServiceDevelopmentEntitiesComponent } from '../service-developmentEntities/service-developmentEntities.component';
@Component({
    selector: 'app-development-service-tabs',
    standalone: true,
    imports: [
        CommonModule,
        TabsModule,
        CardModule,
        AddEditDevelopmentServiceComponent,
        ServiceBeneficiariesComponent,
        ServiceDevelopmentEntitiesComponent,
    ],
    templateUrl: './development-service-tabs.component.html',
    styleUrl: './development-service-tabs.component.scss'
})
export class DevelopmentServiceTabsComponent extends BaseComponent implements OnInit {
    DevelopmentTabs = ServiceDevelopmentEntityTabs;
    activeTab: string = ServiceDevelopmentEntityTabs.Main;
    developmentServiceId: string = '';
    hasActivities: boolean = false;

    constructor(protected override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.developmentServiceId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    }

    get isEditMode(): boolean {
        return !!this.developmentServiceId;
    }

    onActivitiesCountChange(count: number): void {
        this.hasActivities = count > 0;
    }
}
