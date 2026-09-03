import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DevelopmentEntitiesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-development-entity',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './development-entity.component.html',
    styleUrl: './development-entity.component.scss'
})
export class DevelopmentEntityComponent extends BaseEditComponent implements OnInit {
    developmentEntitiesService: DevelopmentEntitiesService = inject(DevelopmentEntitiesService);
    dialogService: DialogService = inject(DialogService);
    city: Lookup | null = null;

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
            this.loadCity();
        }
    }

    loadCity(): void {
        this.developmentEntitiesService.getDevelopmentEntity(this.id).subscribe((res: Lookup) => {
            this.city = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
