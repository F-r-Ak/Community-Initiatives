import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppInfo } from './components/appInfo';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, CardModule],
    template: `
        <div class="dashboardBackground d-flex">
            <div class="linearGradient d-flex justify-content-center align-items-center flex-column gap-4">

                <div class="dashboardInfo">
                    <img class="mb-4" src="assets/img/title (2).png" alt="لوجو" />
                    <p class="mb-4" style="opacity:0.85; font-size:1.2rem;">
                        منصة متكاملة لإدارة ومتابعة المبادرات المجتمعية والتنموية والرئاسية/القومية
                    </p>
                    <div class="d-flex justify-content-center align-items-center">
                        <button class="main-btn main" type="button" pButton (click)="openDialog()">
                            <span class="p-inline-end-1">المزيد من المعلومات</span>
                        </button>
                    </div>
                </div>

                <!-- Quick Navigation Buttons -->
                <div class="db-quick-nav">
                    <button class="db-qbtn" type="button" (click)="navigate('/pages/social-initiatives/initiative-details')">
                        <span class="db-qbtn__icon-wrap"><i class="pi pi-users"></i></span>
                        <span class="db-qbtn__label">المبادرات المجتمعية</span>
                        <i class="pi pi-arrow-left db-qbtn__arrow"></i>
                    </button>

                    <button class="db-qbtn" type="button" (click)="navigate('/pages/develpment-initiatives/development-services')">
                        <span class="db-qbtn__icon-wrap"><i class="pi pi-briefcase"></i></span>
                        <span class="db-qbtn__label">الخدمات التنموية</span>
                        <i class="pi pi-arrow-left db-qbtn__arrow"></i>
                    </button>

                    <button class="db-qbtn" type="button" (click)="navigate('/pages/national-initiatives/initiative-details')">
                        <span class="db-qbtn__icon-wrap"><i class="pi pi-flag"></i></span>
                        <span class="db-qbtn__label">المبادرات الرئاسية/القومية</span>
                        <i class="pi pi-arrow-left db-qbtn__arrow"></i>
                    </button>
                </div>

            </div>
        </div>
    `,
    styles: [`
        .db-quick-nav {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
            direction: rtl;
        }

        .db-qbtn {
            display: flex;
            align-items: center;
            gap: .75rem;
            min-width: 200px;
            padding: .9rem 1.4rem;
            border: 1.5px solid rgba(255, 255, 255, 0.25);
            border-radius: 14px;
            cursor: pointer;
            color: #fff;
            font-family: 'Cairo', sans-serif;
            font-size: .95rem;
            font-weight: 700;
            background: rgba(35, 90, 103, 0.72);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 18px rgba(35, 90, 103, 0.35), inset 0 1px 0 rgba(255,255,255,0.15);
            transition: background .22s ease, transform .2s ease, box-shadow .2s ease;
            text-shadow: 0 1px 3px rgba(0,0,0,0.2);

            &:hover {
                background: rgba(35, 90, 103, 0.92);
                transform: translateY(-3px);
                box-shadow: 0 8px 28px rgba(35, 90, 103, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
                border-color: rgba(255, 255, 255, 0.45);
            }

            &:active {
                transform: translateY(0);
                background: rgba(35, 90, 103, 0.85);
            }
        }

        .db-qbtn__icon-wrap {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.18);
            border: 1px solid rgba(255, 255, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.15rem;
            flex-shrink: 0;
        }

        .db-qbtn__label { flex: 1; }

        .db-qbtn__arrow {
            font-size: .8rem;
            opacity: .75;
            flex-shrink: 0;
        }
    `]
})
export class Dashboard {
    dialogRef: DynamicDialogRef | undefined;
    dialogService = inject(DialogService);
    router = inject(Router);

    navigate(path: string): void {
        this.router.navigate([path]);
    }

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
