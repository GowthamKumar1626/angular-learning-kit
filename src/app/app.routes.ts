import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BindingComponent } from './binding/binding.component';
import { FormComponent } from './form/form.component';
import { PropsComponent } from './props/props.component';
import { ServiceDemoComponent } from './service-demo/service-demo.component';
import { PipesDemoComponent } from './pipes-demo/pipes-demo.component';
import { PipesDocsComponent } from './pipes-docs/pipes-docs.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ProtectedComponent } from './protected/protected.component';
import { ProfileComponent } from './profile/profile.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AuthGuardDocsComponent } from './auth-guard-docs/auth-guard-docs.component';

// Import Guards
import {
  AuthGuard,
  AdminGuard,
  RoleGuard,
  UnsavedChangesGuard,
} from './guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent, title: 'Login - LRMS' },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    title: 'Access Denied - LRMS',
  },

  // Default route - redirect to dashboard
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Dashboard route (protected by AuthGuard)
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard - LRMS',
    canActivate: [AuthGuard],
  },

  // Binding examples route (protected)
  {
    path: 'binding',
    component: BindingComponent,
    title: 'Data Binding Examples - LRMS',
    canActivate: [AuthGuard],
  },

  // Reactive forms route (protected)
  {
    path: 'forms',
    component: FormComponent,
    title: 'Reactive Forms Demo - LRMS',
    canActivate: [AuthGuard],
  },

  // Props demo (protected with lazy loading)
  {
    path: 'props',
    loadComponent: () =>
      import('./props/props.component').then((m) => m.PropsComponent),
    title: 'Props Demo - LRMS',
    canMatch: [AuthGuard],
    canActivate: [AuthGuard],
  },

  // Service and dependency injection demo (protected)
  {
    path: 'services',
    component: ServiceDemoComponent,
    title: 'Services & @Injectable Demo - LRMS',
    canActivate: [AuthGuard],
  },

  // Pipes demo (protected)
  {
    path: 'pipes',
    component: PipesDemoComponent,
    title: 'Pipes Demo - LRMS',
    canActivate: [AuthGuard],
  },

  // Pipes documentation (protected)
  {
    path: 'pipes-docs',
    component: PipesDocsComponent,
    title: 'Pipes Documentation - LRMS',
    canActivate: [AuthGuard],
  },

  // Protected area (AuthGuard demonstration)
  {
    path: 'protected',
    component: ProtectedComponent,
    title: 'Protected Area - LRMS',
    canActivate: [AuthGuard],
  },

  // Admin-only area (AdminGuard demonstration)
  {
    path: 'admin',
    component: AdminComponent,
    title: 'Admin Dashboard - LRMS',
    canActivate: [AdminGuard],
  },

  // Profile page (AuthGuard + UnsavedChangesGuard demonstration)
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'User Profile - LRMS',
    canActivate: [AuthGuard],
    canDeactivate: [UnsavedChangesGuard],
  },

  // Role-based route example (moderator or admin only)
  {
    path: 'moderator',
    component: ProtectedComponent,
    title: 'Moderator Area - LRMS',
    canActivate: [RoleGuard],
    data: { roles: ['moderator', 'admin'] },
  },

  // AuthGuard documentation (public)
  {
    path: 'auth-docs',
    component: AuthGuardDocsComponent,
    title: 'AuthGuard Documentation - LRMS',
  },

  // Wildcard route - must be last
  { path: '**', redirectTo: '/dashboard' },
];
