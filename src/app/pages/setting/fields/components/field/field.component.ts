import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { FieldsService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-field',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './field.component.html',
    styleUrl: './field.component.scss'
})
export class FieldComponent extends BaseEditComponent implements OnInit {
    fieldsService: FieldsService = inject(FieldsService);
    dialogService: DialogService = inject(DialogService);
    field: Lookup | null = null;

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
            this.loadField();
        }
    }

    loadField(): void {
        this.fieldsService.getField(this.id).subscribe((res: Lookup) => {
            this.field = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
