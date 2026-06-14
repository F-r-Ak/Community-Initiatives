import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { CardModule } from 'primeng/card';
import { TableOptions } from '../../../../../shared/interfaces';
import { PrimeDataTableComponent, PrimeTitleToolBarComponent, VwOrganizationsService } from '../../../../../shared';
import { AuthHelper } from '../../../../../core';

@Component({
    selector: 'app-vw-organizations',
    imports: [RouterModule, FormsModule, ReactiveFormsModule, CardModule, PrimeDataTableComponent, PrimeTitleToolBarComponent],
    templateUrl: './vw-organizations.component.html',
    styleUrl: './vw-organizations.component.scss'
})
export class VwOrganizationsComponent extends BaseListComponent {
    tableOptions!: TableOptions;
    service = inject(VwOrganizationsService);
    authHelper = inject(AuthHelper);
    formBuilder: FormBuilder = inject(FormBuilder);

    constructor(activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.initializeTableOptions();
    }

    initializeTableOptions() {
        this.tableOptions = {
            inputUrl: {
                getAll: 'v1/vw_organizations/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/vw_organizations/deletesoft'
            },
            inputCols: this.initializeTableColumns(),
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-SETTINGS-ORGANIZATIONS',
                allowAll: false,
                listOfPermissions: []
            },
            bodyOptions: {
                filter: {}
            },
            responsiveDisplayedProperties: ['name']
        };
    }

    initializeTableColumns(): TableOptions['inputCols'] {
        return [
            {
                field: 'name',
                header: 'اسم الجمعية',
                filter: true,
                filterMode: 'text'
            }
        ];
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
