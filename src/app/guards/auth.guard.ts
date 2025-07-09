import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanMatch,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  UrlSegment,
} from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { UserService, User } from '../services/user.service';

/**
 * AuthGuard - Protects routes that require authentication
 * Implements multiple guard interfaces to demonstrate different use cases
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanMatch {
  private userService = inject(UserService);
  private router = inject(Router);

  /**
   * CanActivate: Guards route activation
   * Used to protect individual routes
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuthentication(state.url);
  }

  /**
   * CanActivateChild: Guards child routes
   * Used to protect all child routes under a parent route
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuthentication(state.url);
  }

  /**
   * CanMatch: Guards route matching for lazy loading
   * Used to prevent loading modules based on conditions
   */
  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const url = '/' + segments.map((s) => s.path).join('/');
    return this.checkAuthentication(url);
  }

  /**
   * Common authentication check logic
   */
  private checkAuthentication(url: string): Observable<boolean> {
    return this.userService.currentUser$.pipe(
      map((user) => {
        const isAuthenticated = user !== null && user.isActive;

        if (!isAuthenticated) {
          console.log('🚫 Access denied - User not authenticated');
          console.log('🔄 Redirecting to login page...');

          // Store the attempted URL for redirect after login
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: url },
            replaceUrl: true,
          });
          return false;
        }

        console.log('✅ Access granted - User authenticated:', user.name);
        return true;
      }),
      tap((canActivate) => {
        if (canActivate) {
          console.log('🔐 AuthGuard: Route access granted');
        } else {
          console.log('🚫 AuthGuard: Route access denied');
        }
      })
    );
  }
}

/**
 * AdminGuard - Protects routes that require admin role
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userService.currentUser$.pipe(
      map((user) => {
        // Check if user is authenticated and has admin role
        const isAdmin = user !== null && user.isActive && user.role === 'admin';

        if (!isAdmin) {
          console.log('🚫 Access denied - Admin role required');

          if (!user) {
            // Not logged in - redirect to login
            this.router.navigate(['/login'], {
              queryParams: { returnUrl: state.url },
              replaceUrl: true,
            });
          } else {
            // Logged in but not admin - redirect to unauthorized
            this.router.navigate(['/unauthorized'], { replaceUrl: true });
          }
          return false;
        }

        console.log('✅ Admin access granted:', user.name);
        return true;
      }),
      tap((canActivate) => {
        if (canActivate) {
          console.log('👑 AdminGuard: Admin route access granted');
        } else {
          console.log('🚫 AdminGuard: Admin route access denied');
        }
      })
    );
  }
}

/**
 * RoleGuard - Generic role-based guard
 * Can be configured to check for specific roles
 */
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private userService = inject(UserService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Get required roles from route data
    const requiredRoles: User['role'][] = route.data?.['roles'] || [];

    return this.userService.currentUser$.pipe(
      map((user) => {
        if (!user || !user.isActive) {
          console.log('🚫 Access denied - User not authenticated');
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: state.url },
            replaceUrl: true,
          });
          return false;
        }

        // Check if user has required role
        const hasRequiredRole =
          requiredRoles.length === 0 || requiredRoles.includes(user.role);

        if (!hasRequiredRole) {
          console.log(
            `🚫 Access denied - Required roles: ${requiredRoles.join(
              ', '
            )}, User role: ${user.role}`
          );
          this.router.navigate(['/unauthorized'], { replaceUrl: true });
          return false;
        }

        console.log(
          `✅ Role access granted - User: ${user.name}, Role: ${user.role}`
        );
        return true;
      }),
      tap((canActivate) => {
        if (canActivate) {
          console.log(`🎭 RoleGuard: Role-based access granted`);
        } else {
          console.log(`🚫 RoleGuard: Role-based access denied`);
        }
      })
    );
  }
}

/**
 * UnsavedChangesGuard - Prevents navigation when there are unsaved changes
 * Implements CanDeactivate to check before leaving a route
 */
export interface CanDeactivateComponent {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
  hasUnsavedChanges(): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesGuard
  implements CanDeactivate<CanDeactivateComponent>
{
  canDeactivate(
    component: CanDeactivateComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Check if component has unsaved changes
    if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
      console.log('⚠️ Unsaved changes detected');

      // Show confirmation dialog
      const confirmLeave = confirm(
        'You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.'
      );

      if (confirmLeave) {
        console.log('✅ User confirmed leaving with unsaved changes');
      } else {
        console.log('🚫 User cancelled navigation to preserve changes');
      }

      return confirmLeave;
    }

    console.log('✅ No unsaved changes - navigation allowed');
    return true;
  }
}
