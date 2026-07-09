import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivityTypesService } from '../../../../../shared';
import { BaseEditComponent } from '../../../../../base/components/base-edit-component';
import { Lookup } from '../../../../../shared/interfaces';

@Component({
    selector: 'app-activity-type',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './activity-type.component.html',
    styleUrl: './activity-type.component.scss'
})
export class ActivityTypeComponent extends BaseEditComponent implements OnInit {
    activityTypesService: ActivityTypesService = inject(ActivityTypesService);
    dialogService: DialogService = inject(DialogService);
    activityType: Lookup | null = null;

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
            this.loadActivityType();
        }
    }

    loadActivityType(): void {
        this.activityTypesService.getActivityType(this.id).subscribe((res: Lookup) => {
            this.activityType = res;
        });
    }

    closeDialog(): void {
        this.dialogService.dialogComponentRefMap.forEach((dialog) => {
            dialog.destroy();
        });
    }
}
