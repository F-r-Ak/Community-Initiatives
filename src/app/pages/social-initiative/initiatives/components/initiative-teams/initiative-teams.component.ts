import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../../../base/components/base-list-component';
import { PrimeDataTableComponent, TableOptions } from '../../../../../shared';
import { InitiativeTeamsService } from '../../../../../shared/services/initiative-teams/initiative-teams.service';
import { AddEditInitiativeTeamComponent } from '../add-edit-initiative-team/add-edit-initiative-team.component';
import { AuthHelper } from '../../../../../core';
import { RoleCodes } from '../../../../../core/enums/role';

@Component({
    selector: 'app-initiative-teams',
    standalone: true,
    imports: [PrimeDataTableComponent],
    templateUrl: './initiative-teams.component.html',
    styleUrl: './initiative-teams.component.scss'
})
export class InitiativeTeamsComponent extends BaseListComponent implements OnInit {
    @Input() initiativeId: string = '';

    tableOptions!: TableOptions;
    authHelper = inject(AuthHelper);
    service = inject(InitiativeTeamsService);
    get rolesEnum() {
        return RoleCodes;
    }
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
                getAll: 'v1/initiativeteams/getpaged',
                getAllMethod: 'POST',
                delete: 'v1/initiativeteams/delete'
            },
            inputCols: [
                { field: 'teamMemberName', header: 'اسم العضو', filter: true, filterMode: 'text' }
            ],
            inputActions: [
                {
                    name: 'DELETE',
                    icon: 'pi pi-trash',
                    color: 'text-error',
                    allowAll: true,
                    isDelete: true
                }
            ],
            permissions: {
                componentName: 'COMMUNITY-INITIATIVES-INITIATIVE-TEAMS',
                allowAll: true,
                listOfPermissions: []
            },
            bodyOptions: {

                filter: this.authHelper.hasRole(this.rolesEnum.Employee)
                    ? { createdById: this.authHelper.getUserId(), initiativeId: this.initiativeId }
                    : { initiativeId: this.initiativeId }
            }
        };
    }

    openAddEditDialog(row?: any) {
        this.openDialog(
            AddEditInitiativeTeamComponent,
            row ? 'تعديل عضو الفريق' : 'اضافة عضو الفريق',
            { id: row?.id ?? null, initiativeId: this.initiativeId }
        );
    }

    override ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
