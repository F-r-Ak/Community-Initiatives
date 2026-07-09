import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EntitiesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-entity',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './entity.component.html',
    styleUrl: './entity.component.scss'
})
export class EntityComponent extends BaseEditComponent implements OnInit {
    entitiesService: EntitiesService = inject(EntitiesService);
    dialogService: DialogService = inject(DialogService);
    entity: Lookup | null = null;

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
            this.loadEntity();
        }
    }

    loadEntity(): void {
        this.entitiesService.getEntity(this.id).subscribe((res: Lookup) => {
            this.entity = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
