import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ServiceDevelopmentEntitiesService } from '../../../../../shared';
import { ServiceDevelopmentEntityDto } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-service-developmentEntity',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './service-developmentEntity.component.html',
    styleUrl: './service-developmentEntity.component.scss'
})
export class ServiceDevelopmentEntityComponent implements OnInit {
    dialogConfig = inject(DynamicDialogConfig);
    service = inject(ServiceDevelopmentEntitiesService);

    record: ServiceDevelopmentEntityDto | null = null;

    ngOnInit(): void {
        const data = this.dialogConfig.data;
        const id: string = data?.row?.rowData?.id ?? data?.id ?? null;

        if (id) {
            this.service.getServiceDevelopmentEntity(id).subscribe({
                next: (res: any) => (this.record = res)
            });
        } else {
            this.record = data?.row?.rowData ?? data?.row ?? null;
        }
    }
}
