import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    standalone: true,
    selector: 'app-app-info',
    imports: [ButtonModule, MenuModule],
    styles: [`
        .app-info-wrapper {
            background: linear-gradient(160deg, #f9f5e9 0%, #ffffff 100%);
            border-radius: 12px;
            padding: 1.5rem 1rem;
        }
        .logo-container {
            border-radius: 12px;
            padding: 1rem 2rem;
            display: inline-block;
            margin-bottom: 1rem;
            box-shadow: 0 4px 15px rgba(53, 121, 136, 0.3);
        }
        .subtitle {
            color: #897a68;
            font-size: 1rem;
            border-right: 3px solid #c1924c;
            padding-right: 0.75rem;
            text-align: right;
            margin-bottom: 1.25rem;
            line-height: 1.7;
        }
        .section-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: linear-gradient(135deg, #357988, #2a5f6b);
            color: #ffffff;
            border-radius: 8px;
            padding: 0.5rem 1rem;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            width: 100%;
            justify-content: flex-end;
            flex-direction: row-reverse;
        }
        .section-header i {
            color: #e7cfb4;
        }
        .section-header p {
            margin: 0;
            font-weight: 600;
            font-size: 0.95rem;
        }
        .child-item {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.4rem 0.75rem;
            border-radius: 6px;
            background: rgba(53, 121, 136, 0.06);
            border: 1px solid rgba(53, 121, 136, 0.12);
            margin-bottom: 0.4rem;
            width: 100%;
            justify-content: flex-end;
            transition: background 0.2s;
            flex-direction: row-reverse;
        }
        .child-item:hover {
            background: rgba(53, 121, 136, 0.12);
        }
        .child-item i {
            color: #c1924c;
            font-size: 0.85rem;
        }
        .child-item span {
            color: #1f2937;
            font-size: 0.9rem;
        }
    `],
    template: `
        <div class="app-info-wrapper" dir="rtl">
            <div class="text-center">
                <div class="logo-container">
                    <img src="assets/img/title(1).png" alt="title" style="max-height:70px; max-width:100%;" />
                </div>
            </div>

            <p class="subtitle">
                منصة متكاملة لإدارة ومتابعة المبادرات المجتمعية والتنموية
            </p>

            @for (item of items; track $index) {
                <div class="section-header">
                    <p>{{ item.label }}</p>
                    <i [class]="item.icon"></i>
                </div>

                @if (item.children) {
                    <ul class="list-unstyled w-100 mt-1 mb-0 px-1">
                        @for (child of item.children; track $index) {
                            <li class="child-item">
                                <span>{{ child.label }}</span>
                                <i [class]="child.icon"></i>
                            </li>
                        }
                    </ul>
                }
            }
        </div>
    `
})
export class AppInfo {
    items = [
        {
            label: 'الوحدات المتاحة في النظام :',
            icon: 'pi pi-fw pi-th-large',
            children: [
                { label: 'المبادرات التنموية والمجتمعية ', icon: 'pi pi-fw pi-heart' },
                { label: 'إدارة المستخدمين والصلاحيات', icon: 'pi pi-fw pi-users' },
                { label: 'إدارة الإدارات والوحدات التنظيمية', icon: 'pi pi-fw pi-sitemap' }
            ]
        },
        {
            label: 'المستفيدون من التطبيق :',
            icon: 'pi pi-fw pi-star',
            children: [
                { label: 'المسؤولون عن المبادرات المجتمعية', icon: 'pi pi-fw pi-user' },
                { label: 'مديرو الجمعيات والمنظمات', icon: 'pi pi-fw pi-user' },
                { label: 'مسؤولو الإدارة والمتابعة', icon: 'pi pi-fw pi-user' }
            ]
        }
    ];
}
