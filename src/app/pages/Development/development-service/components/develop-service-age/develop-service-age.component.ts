import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DevelopServiceAgesService } from '../../../../../shared';
import { DevelopServiceAgeDto } from '../../../../../shared/interfaces/develop-service-age/develop-service-age';

@Component({
    selector: 'app-develop-service-age',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './develop-service-age.component.html',
    styleUrl: './develop-service-age.component.scss'
})
export class DevelopServiceAgeComponent implements OnInit {
    dialogConfig = inject(DynamicDialogConfig);
    service = inject(DevelopServiceAgesService);

    record: DevelopServiceAgeDto | null = null;

    ngOnInit(): void {
        const data = this.dialogConfig.data;
        const id: string = data?.row?.rowData?.id ?? data?.id ?? null;

        if (id) {
            this.service.getDevelopServiceAge(id).subscribe({
                next: (res: any) => (this.record = res)
            });
        } else {
            this.record = data?.row?.rowData ?? data?.row ?? null;
        }
    }
}
