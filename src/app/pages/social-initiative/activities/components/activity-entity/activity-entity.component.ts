import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ActivityEntitiesService } from '../../../../../shared';
import { ActivityEntityDto } from '../../../../../shared/interfaces/activity-entity/activity-entity';

@Component({
    selector: 'app-activity-entity',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './activity-entity.component.html',
    styleUrl: './activity-entity.component.scss'
})
export class ActivityEntityComponent implements OnInit {
    dialogConfig = inject(DynamicDialogConfig);
    service = inject(ActivityEntitiesService);

    record: ActivityEntityDto | null = null;

    ngOnInit(): void {
        const data = this.dialogConfig.data;
        const id: string = data?.row?.rowData?.id ?? data?.id ?? null;

        if (id) {
            this.service.getActivityEntity(id).subscribe({
                next: (res: any) => (this.record = res)
            });
        } else {
            this.record = data?.row?.rowData ?? data?.row ?? null;
        }
    }
}
