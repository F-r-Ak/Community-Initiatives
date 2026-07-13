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
    }
];
