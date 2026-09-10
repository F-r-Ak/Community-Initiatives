import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MediaInitiativesService } from '../../../../../shared/services/media-initiatives/media-initiatives.service';
import { MediaInitiativeDto } from '../../../../../shared/interfaces/mediainitiative/media-initiative';

@Component({
    selector: 'app-service-beneficiary',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './service-beneficiary.component.html',
    styleUrl: './service-beneficiary.component.scss'
})
export class ServiceBeneficiaryComponent implements OnInit {
    dialogConfig = inject(DynamicDialogConfig);
    service = inject(MediaInitiativesService);

    record: MediaInitiativeDto | null = null;

    ngOnInit(): void {
        const data = this.dialogConfig.data;
        const id: string = data?.row?.rowData?.id ?? data?.id ?? null;

        if (id) {
            this.service.getMediaInitiative(id).subscribe({
                next: (res: any) => (this.record = res)
            });
        } else {
            this.record = data?.row?.rowData ?? data?.row ?? null;
        }
    }
}
