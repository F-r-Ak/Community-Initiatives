import { Routes } from '@angular/router';

export const activitiesRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/activities/activities.component').then((c) => c.ActivitiesComponent),
        data: { pageTitle: 'الأنشطة', pageType: 'list' }
    },
    {
        path: 'beneficiary-groups/:activityId',
        loadComponent: () => import('./components/activity-beneficiary-groups/activity-beneficiary-groups.component').then((c) => c.ActivityBeneficiaryGroupsComponent),
        data: { pageTitle: 'مجموعة المستفيدين', pageType: 'list' }
    },
    {
        path: 'add',
        loadComponent: () => import('./components/activity-tabs/activity-tabs.component').then((c) => c.ActivityTabsComponent),
        data: { pageTitle: 'اضافة نشاط', pageType: 'add' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/activity-tabs/activity-tabs.component').then((c) => c.ActivityTabsComponent),
        data: { pageTitle: 'تعديل نشاط', pageType: 'edit' }
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/activity/activity.component').then((c) => c.ActivityComponent),
        data: { pageTitle: 'عرض النشاط', pageType: 'view' }
    }
];
