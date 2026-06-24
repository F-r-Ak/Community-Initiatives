import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppInfo } from './components/appInfo';

interface QuickLink {
    label: string;
    description: string;
    icon: string;
    route: string;
    color: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, CardModule],
    template: `
        <div class="dashboardBackground d-flex">
            <div class="linearGradient d-flex justify-content-center align-items-center">
                <div class="dashboardInfo">
                    <img class="mb-4" src="assets/img/title (2).png" alt="لوجو" />
                    <p class="mb-4" style="opacity:0.85; font-size:1.2rem;">
                        منصة متكاملة لإدارة ومتابعة المبادرات المجتمعية والتنموية
                    </p>
                    <div class="d-flex justify-content-center align-items-center">
                        <button class="main-btn main" type="button" pButton (click)="openDialog()">
                            <span class="p-inline-end-1">المزيد من المعلومات</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [``]
})
export class Dashboard {
    dialogRef: DynamicDialogRef | undefined;
    dialogService = inject(DialogService);

    openDialog(): void {
        this.dialogRef = this.dialogService.open(AppInfo, {
            header: 'معلومات عن النظام',
            width: '45%',
            modal: true,
            breakpoints: { '1199px': '75vw', '575px': '90vw' },
            focusOnShow: false,
            autoZIndex: true,
            baseZIndex: 10000,
            dismissableMask: true,
            closable: true
        });
    }
}
