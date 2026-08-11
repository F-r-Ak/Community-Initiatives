import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { DevelpmentInitiativeDto } from '../../../../../shared/interfaces';
import { DevelpmentInitiativesService } from '../../../../../shared/services/develpment-initiatives/develpment-initiatives.service';

@Component({
    selector: 'app-develpment-initiative',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './develpment-initiative.component.html',
    styleUrl: './develpment-initiative.component.scss'
})
export class DevelpmentInitiativeComponent extends BaseEditComponent implements OnInit {
    develpmentInitiativesService = inject(DevelpmentInitiativesService);
    dialogService: DialogService = inject(DialogService);
    develpmentInitiative: DevelpmentInitiativeDto | null = null;

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
            this.loadDevelpmentInitiative();
        }
    }

    loadDevelpmentInitiative(): void {
        this.develpmentInitiativesService.getDevelpmentInitiative(this.id).subscribe((res:  DevelpmentInitiativeDto) => {
            this.develpmentInitiative = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
