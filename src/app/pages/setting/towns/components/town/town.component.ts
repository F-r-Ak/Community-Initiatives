import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { TownsService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { TownDto } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-town',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './town.component.html',
    styleUrl: './town.component.scss'
})
export class TownComponent extends BaseEditComponent implements OnInit {
    townsService: TownsService = inject(TownsService);
    dialogService: DialogService = inject(DialogService);
    town: TownDto | null = null;

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
            this.loadTown();
        }
    }

    loadTown(): void {
        this.townsService.getTown(this.id).subscribe((res: TownDto) => {
            this.town = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
