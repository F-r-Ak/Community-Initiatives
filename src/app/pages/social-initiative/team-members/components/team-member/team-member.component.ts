import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { TeamMembersService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { TeamMemberDto } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-team-member',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './team-member.component.html',
    styleUrl: './team-member.component.scss'
})
export class TeamMemberComponent extends BaseEditComponent implements OnInit {
    teamMembersService: TeamMembersService = inject(TeamMembersService);
    dialogService: DialogService = inject(DialogService);
    teamMember: TeamMemberDto | null = null;

    constructor(override activatedRoute: ActivatedRoute) {
        super(activatedRoute);
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.dialogService.dialogComponentRefMap.forEach((element) => {
            this.pageType = element.instance.ddconfig.data.pageType;
            if (this.pageType === 'view') {
                this.id = element.instance.ddconfig.data.row.rowData.id;
            }
        });
        if (this.id) {
            this.loadTeamMember();
        }
    }

    loadTeamMember(): void {
        this.teamMembersService.getTeamMember(this.id).subscribe((res: TeamMemberDto) => {
            this.teamMember = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
