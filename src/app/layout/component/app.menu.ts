import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthHelper } from '../../core';
import { Subscription } from 'rxjs';
import { RoleCodes } from '../../core/enums/role';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    authHelper = inject(AuthHelper);
    private userSub?: Subscription;
    get rolesEnum() {
        return RoleCodes;
    }
    ngOnInit() {
        // Build menu initially
        this.buildModel();
        // Rebuild menu whenever user data changes (login/logout)
        this.userSub = this.authHelper.userData$.subscribe(() => {
            this.buildModel();
        });
    }

    ngOnDestroy(): void {
        this.userSub?.unsubscribe();
    }

    private buildModel(): void {

        this.model = [
            this.authHelper.hasRole(this.rolesEnum.Administrator) ?
                {
                    label: 'الإحصائيات',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        {
                            label: 'إحصائيات المبادرات',
                            icon: 'pi pi-fw pi-chart-bar',
                            routerLink: ['/pages/social-initiatives/initiatives/dashboard']
                        }
                    ]
                } : { styleClass: 'v' },

            this.authHelper.hasRole(this.rolesEnum.Administrator) ?
                {
                    label: 'الاعدادات',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        {
                            label: 'أنواع النشاط',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/settings/activity-types']
                        },
                        {
                            label: 'أنواع التنفيذ',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/settings/execute-types']
                        },
                        {
                            label: 'المجالات',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/settings/fields']
                        },
                        {
                            label: 'المديريات',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/settings/entities']
                        },
                        {
                            label: 'الجمعيات',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/settings/organizations']
                        },
                        {
                            label: 'فئة المستهدفين',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/settings/beneficiary-groups']
                        },
                        {
                            label: 'أعضاء الفريق',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/settings/team-members']
                        },
                        {
                            label: 'المراكز',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/settings/cities']
                        },
                        {
                            label: 'المدن',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/settings/towns']
                        }
                    ]
                } : { styleClass: 'v' },

            this.authHelper.hasRole(this.rolesEnum.Administrator) || this.authHelper.hasRole(this.rolesEnum.Employee) ?
                {
                    label: 'المبادرات التنموية',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        {
                            label: 'المبادرات',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/social-initiatives/initiatives']
                        },
                        {
                            label: 'الأنشطة',
                            icon: 'pi pi-fw pi-calendar',
                            routerLink: ['/pages/social-initiatives/activities']
                        }
                    ]
                } : { styleClass: 'v' },
            this.authHelper.hasRole(this.rolesEnum.Administrator) ?
                {
                    label: ' التقارير',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        {
                            label: 'تقرير',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/pages/report']
                        },

                    ]
                } : { styleClass: 'v' },


            this.authHelper.hasRole(this.rolesEnum.Administrator) ?
                {
                    label: 'إدارة الصلاحيات',
                    icon: 'pi pi-fw pi-lock',
                    // routerLink: ['/pages'],
                    items: [
                        {
                            label: 'المستخدمين',
                            icon: 'pi pi-fw pi-user',
                            routerLink: ['/pages/auth/users']
                        },
                        {
                            label: 'الصلاحيات',
                            icon: 'pi pi-fw pi-lock',
                            routerLink: ['/pages/auth/roles']
                        },

                    ]
                } : { styleClass: 'v' }
        ];
    }
}
