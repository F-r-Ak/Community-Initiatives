import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivityBeneficiaryGroupsService } from '../../../../../shared';
import { ActivityBeneficiaryGroupDto } from '../../../../../shared/interfaces/activity-beneficiary-group/activity-beneficiary-group';

@Component({
    selector: 'app-activity-beneficiary-group',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './activity-beneficiary-group.component.html',
    styleUrl: './activity-beneficiary-group.component.scss'
})
export class ActivityBeneficiaryGroupComponent implements OnInit {
 dialogConfig = inject(DynamicDialogConfig);
    service = inject(ActivityBeneficiaryGroupsService);

    record: ActivityBeneficiaryGroupDto | null = null;

    ngOnInit(): void {
        const data = this.dialogConfig.data;
        const id: string = data?.row?.rowData?.id ?? data?.id ?? null;

        if (id) {
            this.service.getActivityBeneficiaryGroup(id).subscribe({
                next: (res: any) => (this.record = res)
            });
        } else {
            // data passed directly (e.g. row already contains full object)
            this.record = data?.row?.rowData ?? data?.row ?? null;
        }
    }
}
