import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ServiceDetailsService } from '../../../../../shared';
import { ServiceDetailDto } from '../../../../../shared/interfaces/service-detail/service-detail';

@Component({
    selector: 'app-service-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './service-detail.component.html',
    styleUrl: './service-detail.component.scss'
})
export class ServiceDetailComponent implements OnInit {
    dialogConfig = inject(DynamicDialogConfig);
    service = inject(ServiceDetailsService);

    record: ServiceDetailDto | null = null;

    ngOnInit(): void {
        const data = this.dialogConfig.data;
        const id: string = data?.row?.rowData?.id ?? data?.id ?? null;

        if (id) {
            this.service.getServiceDetail(id).subscribe({
                next: (res: any) => (this.record = res)
            });
        } else {
            this.record = data?.row?.rowData ?? data?.row ?? null;
        }
    }
}
