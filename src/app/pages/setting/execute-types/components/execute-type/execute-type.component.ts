import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ExecuteTypesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-execute-type',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './execute-type.component.html',
    styleUrl: './execute-type.component.scss'
})
export class ExecuteTypeComponent extends BaseEditComponent implements OnInit {
    executeTypesService: ExecuteTypesService = inject(ExecuteTypesService);
    dialogService: DialogService = inject(DialogService);
    executeType: Lookup | null = null;

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
            this.loadExecuteType();
        }
    }

    loadExecuteType(): void {
        this.executeTypesService.getExecuteType(this.id).subscribe((res: Lookup) => {
            this.executeType = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
