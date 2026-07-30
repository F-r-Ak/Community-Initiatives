import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InitiativeTeamsService } from '../../../../../shared/services/initiative-teams/initiative-teams.service';
import { InitiativeTeamDto } from '../../../../../shared/interfaces/initiative-team/initiative-team';

@Component({
    selector: 'app-initiative-team',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './initiative-team.component.html',
    styleUrl: './initiative-team.component.scss'
})
export class InitiativeTeamComponent implements OnInit {
    dialogConfig = inject(DynamicDialogConfig);
    service = inject(InitiativeTeamsService);

    record: InitiativeTeamDto | null = null;

    ngOnInit(): void {
        const data = this.dialogConfig.data;
        const id: string = data?.row?.rowData?.id ?? data?.id ?? null;

        if (id) {
            this.service.getInitiativeTeam(id).subscribe({
                next: (res: any) => (this.record = res)
            });
        } else {
            this.record = data?.row?.rowData ?? data?.row ?? null;
        }
    }
}
