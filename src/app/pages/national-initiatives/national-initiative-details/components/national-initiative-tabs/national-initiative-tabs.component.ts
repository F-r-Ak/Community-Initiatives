import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { BaseComponent } from '../../../../../base/components/base-component';
import { NationalInitiativeTabs } from '../../../../../core/enums/national-initiative-tabs';
import { AddEditNationalInitiativeComponent } from '../add-edit-national-initiative/add-edit-national-initiative.component';
import { NationalBeneficiariesComponent } from '../national-beneficiaries/national-beneficiaries.component';
import { NationalEntitiesComponent } from '../national-entities/national-entities.component';
import { NationalSupportsComponent } from '../national-supports/national-supports.component';
import { AuthHelper } from '../../../../../core/helpers/helper';
import { RoleCodes } from '../../../../../core/enums/role';
@Component({
    selector: 'app-national-initiative-tabs',
    standalone: true,
    imports: [
        CommonModule,
        TabsModule,
        CardModule,
        AddEditNationalInitiativeComponent,
        NationalBeneficiariesComponent,
        NationalEntitiesComponent,
        NationalSupportsComponent
    ],
  templateUrl: './national-initiative-tabs.component.html',
  styleUrl: './national-initiative-tabs.component.scss'
})
export class NationalInitiativeTabsComponent extends BaseComponent implements OnInit {
    NationalInitiativeTabs = NationalInitiativeTabs;
    activeTab: string = NationalInitiativeTabs.Main;
    initiativeId: string = '';
    hasActivities: boolean = false;

    private authHelper = inject(AuthHelper);

    get isOrgUser(): boolean {
        return this.authHelper.hasRole(RoleCodes.OrgUser);
    }

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
