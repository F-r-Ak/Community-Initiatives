import { Routes } from '@angular/router';

export const teamMembersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/team-members/team-members.component').then(c => c.TeamMembersComponent),
    data: { pageTitle: 'أعضاء الفريق', pageType: 'list' }
  },
  {
    path: 'add',
    loadComponent: () => import('./components/add-edit-team-member/add-edit-team-member.component').then(c => c.AddEditTeamMemberComponent),

    data: { pageTitle: 'اضافة عضو فريق', pageType: 'add' }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/add-edit-team-member/add-edit-team-member.component').then(c => c.AddEditTeamMemberComponent),

    data: { pageTitle: 'تعديل عضو فريق', pageType: 'edit' }
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./components/team-member/team-member.component').then(c => c.TeamMemberComponent),

    data: { pageTitle: 'عرض عضو فريق', pageType: 'view' }
  }
];
