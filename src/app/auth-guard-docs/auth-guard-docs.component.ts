import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-guard-docs',
  template: `
    <div class="docs-container">
      <div class="docs-header">
        <h1>🛡️ Angular AuthGuard Complete Guide</h1>
        <p>Understanding Route Guards, Authentication, and Access Control</p>
      </div>

      <!-- What is AuthGuard -->
      <section class="docs-section">
        <h2>What is AuthGuard?</h2>
        <div class="content-card">
          <p>
            <strong>AuthGuard</strong> is a route guard in Angular that controls
            navigation based on authentication status and user permissions. It
            implements Angular's guard interfaces to protect routes from
            unauthorized access.
          </p>

          <div class="key-points">
            <h3>Key Concepts:</h3>
            <ul>
              <li>
                <strong>Route Protection:</strong> Prevents unauthorized users
                from accessing protected routes
              </li>
              <li>
                <strong>Authentication Check:</strong> Verifies if user is
                logged in and active
              </li>
              <li>
                <strong>Role-based Access:</strong> Controls access based on
                user roles (admin, moderator, user)
              </li>
              <li>
                <strong>Automatic Redirection:</strong> Redirects to login or
                unauthorized pages when access is denied
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Guard Types -->
      <section class="docs-section">
        <h2>Guard Types Implemented</h2>
        <div class="guard-types-grid">
          <div class="guard-card">
            <h3>🔐 AuthGuard</h3>
            <div class="guard-interfaces">
              <span class="interface-badge">CanActivate</span>
              <span class="interface-badge">CanActivateChild</span>
              <span class="interface-badge">CanMatch</span>
            </div>
            <p><strong>Purpose:</strong> Basic authentication check</p>
            <p><strong>Usage:</strong> Protects routes requiring login</p>
            <div class="code-example">
              <pre><code>canActivate: [AuthGuard]</code></pre>
            </div>
          </div>

          <div class="guard-card">
            <h3>👑 AdminGuard</h3>
            <div class="guard-interfaces">
              <span class="interface-badge">CanActivate</span>
            </div>
            <p><strong>Purpose:</strong> Admin-only access control</p>
            <p><strong>Usage:</strong> Protects admin-specific routes</p>
            <div class="code-example">
              <pre><code>canActivate: [AdminGuard]</code></pre>
            </div>
          </div>

          <div class="guard-card">
            <h3>🎭 RoleGuard</h3>
            <div class="guard-interfaces">
              <span class="interface-badge">CanActivate</span>
            </div>
            <p><strong>Purpose:</strong> Role-based access control</p>
            <p><strong>Usage:</strong> Configurable role requirements</p>
            <div class="code-example">
              <pre><code>canActivate: [RoleGuard]
data: &#123; roles: ['admin', 'moderator'] &#125;</code></pre>
            </div>
          </div>

          <div class="guard-card">
            <h3>💾 UnsavedChangesGuard</h3>
            <div class="guard-interfaces">
              <span class="interface-badge">CanDeactivate</span>
            </div>
            <p>
              <strong>Purpose:</strong> Prevent navigation with unsaved changes
            </p>
            <p><strong>Usage:</strong> Forms and editing pages</p>
            <div class="code-example">
              <pre><code>canDeactivate: [UnsavedChangesGuard]</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Implementation Details -->
      <section class="docs-section">
        <h2>Implementation Details</h2>

        <div class="implementation-tabs">
          <div class="tab-content">
            <h3>1. Guard Service Creation</h3>
            <div class="code-block">
              <pre><code>&#64;Injectable(&#123;
  providedIn: 'root'
&#125;)
export class AuthGuard implements CanActivate &#123;
  private userService = inject(UserService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) &#123;
    return this.userService.currentUser$.pipe(
      map(user => &#123;
        const isAuthenticated = user !== null && user.isActive;
        
        if (!isAuthenticated) &#123;
          this.router.navigate(['/login'], &#123; 
            queryParams: &#123; returnUrl: state.url &#125;
          &#125;);
          return false;
        &#125;
        
        return true;
      &#125;)
    );
  &#125;
&#125;</code></pre>
            </div>
          </div>

          <div class="tab-content">
            <h3>2. Route Configuration</h3>
            <div class="code-block">
              <pre><code>export const routes: Routes = [
  // Public routes
  &#123; path: 'login', component: LoginComponent &#125;,
  
  // Protected routes
  &#123;
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  &#125;,
  
  // Admin-only routes
  &#123;
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  &#125;,
  
  // Role-based routes
  &#123;
    path: 'moderator',
    component: ModeratorComponent,
    canActivate: [RoleGuard],
    data: &#123; roles: ['moderator', 'admin'] &#125;
  &#125;
];</code></pre>
            </div>
          </div>

          <div class="tab-content">
            <h3>3. Service Integration</h3>
            <div class="code-block">
              <pre><code>&#64;Injectable(&#123; providedIn: 'root' &#125;)
export class UserService &#123;
  private currentUserSubject = new BehaviorSubject&lt;User | null&gt;(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  isLoggedIn(): boolean &#123;
    return this.currentUserSubject.value !== null;
  &#125;

  hasRole(role: string): boolean &#123;
    const user = this.currentUserSubject.value;
    return user?.role === role || false;
  &#125;

  isAdmin(): boolean &#123;
    return this.hasRole('admin');
  &#125;
&#125;</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Guard Interfaces -->
      <section class="docs-section">
        <h2>Guard Interfaces Explained</h2>
        <div class="interfaces-grid">
          <div class="interface-card">
            <h3>CanActivate</h3>
            <p>
              <strong>Purpose:</strong> Controls whether a route can be
              activated
            </p>
            <p><strong>When to use:</strong> Individual route protection</p>
            <p>
              <strong>Return value:</strong> boolean | Observable&lt;boolean&gt;
              | Promise&lt;boolean&gt;
            </p>
            <div class="example">
              <strong>Example:</strong> Checking if user is authenticated before
              accessing dashboard
            </div>
          </div>

          <div class="interface-card">
            <h3>CanActivateChild</h3>
            <p>
              <strong>Purpose:</strong> Controls whether child routes can be
              activated
            </p>
            <p>
              <strong>When to use:</strong> Protecting all child routes under a
              parent
            </p>
            <p>
              <strong>Return value:</strong> boolean | Observable&lt;boolean&gt;
              | Promise&lt;boolean&gt;
            </p>
            <div class="example">
              <strong>Example:</strong> Protecting entire admin section with
              nested routes
            </div>
          </div>

          <div class="interface-card">
            <h3>CanMatch</h3>
            <p>
              <strong>Purpose:</strong> Controls whether a route can be matched
              for lazy loading
            </p>
            <p>
              <strong>When to use:</strong> Conditional module loading based on
              permissions
            </p>
            <p>
              <strong>Return value:</strong> boolean | Observable&lt;boolean&gt;
              | Promise&lt;boolean&gt;
            </p>
            <div class="example">
              <strong>Example:</strong> Only load admin module if user has admin
              role
            </div>
          </div>

          <div class="interface-card">
            <h3>CanDeactivate</h3>
            <p>
              <strong>Purpose:</strong> Controls whether a route can be left
            </p>
            <p>
              <strong>When to use:</strong> Preventing navigation with unsaved
              changes
            </p>
            <p>
              <strong>Return value:</strong> boolean | Observable&lt;boolean&gt;
              | Promise&lt;boolean&gt;
            </p>
            <div class="example">
              <strong>Example:</strong> Warning user before leaving form with
              unsaved data
            </div>
          </div>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="docs-section">
        <h2>Best Practices</h2>
        <div class="best-practices">
          <div class="practice-item">
            <h4>✅ Always Handle Reactive Data</h4>
            <p>
              Use Observables from services to react to authentication state
              changes in real-time.
            </p>
          </div>

          <div class="practice-item">
            <h4>✅ Store Return URLs</h4>
            <p>
              Save the attempted URL and redirect users there after successful
              login.
            </p>
          </div>

          <div class="practice-item">
            <h4>✅ Provide Clear Error Messages</h4>
            <p>
              Show users why access was denied and what they can do about it.
            </p>
          </div>

          <div class="practice-item">
            <h4>✅ Use Type-Safe Role Checking</h4>
            <p>
              Define role types and use them consistently across guards and
              services.
            </p>
          </div>

          <div class="practice-item">
            <h4>✅ Implement Logging</h4>
            <p>Log guard decisions for debugging and security monitoring.</p>
          </div>

          <div class="practice-item">
            <h4>✅ Test Edge Cases</h4>
            <p>
              Test scenarios like token expiration, role changes, and network
              failures.
            </p>
          </div>
        </div>
      </section>

      <!-- Common Patterns -->
      <section class="docs-section">
        <h2>Common Guard Patterns</h2>
        <div class="patterns-grid">
          <div class="pattern-card">
            <h3>🔄 Redirect Pattern</h3>
            <p>
              Automatically redirect unauthorized users to appropriate pages
            </p>
            <div class="pattern-example">
              <pre><code>if (!user) &#123;
  router.navigate(['/login'], &#123; 
    queryParams: &#123; returnUrl: state.url &#125;
  &#125;);
&#125; else if (!hasPermission) &#123;
  router.navigate(['/unauthorized']);
&#125;</code></pre>
            </div>
          </div>

          <div class="pattern-card">
            <h3>🎯 Role Hierarchy Pattern</h3>
            <p>
              Define role hierarchies where higher roles include lower
              permissions
            </p>
            <div class="pattern-example">
              <pre><code>const roleHierarchy = &#123;
  'admin': ['admin', 'moderator', 'user'],
  'moderator': ['moderator', 'user'],
  'user': ['user']
&#125;;

hasPermission = roleHierarchy[user.role]?.includes(requiredRole);</code></pre>
            </div>
          </div>

          <div class="pattern-card">
            <h3>⏰ Token Expiration Pattern</h3>
            <p>Check token validity and refresh if needed</p>
            <div class="pattern-example">
              <pre><code>canActivate(): Observable&lt;boolean&gt; &#123;
  return this.authService.isTokenValid().pipe(
    switchMap(isValid => &#123;
      if (!isValid) &#123;
        return this.authService.refreshToken();
      &#125;
      return of(true);
    &#125;)
  );
&#125;</code></pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .docs-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
        line-height: 1.6;
      }

      .docs-header {
        text-align: center;
        margin-bottom: 50px;
        padding: 40px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 16px;
      }

      .docs-header h1 {
        margin: 0 0 15px 0;
        font-size: 3rem;
        font-weight: 300;
      }

      .docs-header p {
        margin: 0;
        font-size: 1.3rem;
        opacity: 0.9;
      }

      .docs-section {
        margin-bottom: 50px;
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e9ecef;
      }

      .docs-section h2 {
        color: #2c3e50;
        margin-bottom: 25px;
        font-size: 2rem;
        border-bottom: 3px solid #667eea;
        padding-bottom: 10px;
      }

      .content-card {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 10px;
        border-left: 5px solid #667eea;
      }

      .content-card p {
        margin-bottom: 20px;
        color: #495057;
        font-size: 1.1rem;
      }

      .key-points h3 {
        color: #495057;
        margin-bottom: 15px;
      }

      .key-points ul {
        color: #6c757d;
        padding-left: 20px;
      }

      .key-points li {
        margin-bottom: 8px;
      }

      /* Guard Types Grid */
      .guard-types-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }

      .guard-card {
        background: #fff;
        border: 2px solid #e9ecef;
        border-radius: 12px;
        padding: 25px;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
      }

      .guard-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .guard-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.15);
        border-color: #667eea;
      }

      .guard-card h3 {
        color: #2c3e50;
        margin-bottom: 15px;
        font-size: 1.4rem;
      }

      .guard-interfaces {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 15px;
      }

      .interface-badge {
        background: #667eea;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .guard-card p {
        color: #6c757d;
        margin-bottom: 10px;
      }

      .code-example {
        background: #f8f9fa;
        border-radius: 6px;
        padding: 12px;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.85rem;
        border-left: 3px solid #667eea;
        margin-top: 15px;
      }

      /* Implementation Tabs */
      .implementation-tabs {
        display: grid;
        gap: 30px;
      }

      .tab-content h3 {
        color: #495057;
        margin-bottom: 15px;
        font-size: 1.3rem;
      }

      .code-block {
        background: #2d3748;
        color: #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        overflow-x: auto;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        border: 1px solid #4a5568;
      }

      .code-block pre {
        margin: 0;
        white-space: pre-wrap;
      }

      /* Interfaces Grid */
      .interfaces-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }

      .interface-card {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        border-radius: 10px;
        padding: 20px;
        border-left: 5px solid #667eea;
      }

      .interface-card h3 {
        color: #667eea;
        margin-bottom: 15px;
        font-size: 1.2rem;
      }

      .interface-card p {
        color: #495057;
        margin-bottom: 8px;
        font-size: 0.95rem;
      }

      .example {
        background: white;
        padding: 12px;
        border-radius: 6px;
        margin-top: 15px;
        border-left: 3px solid #28a745;
        font-size: 0.9rem;
        color: #495057;
      }

      /* Best Practices */
      .best-practices {
        display: grid;
        gap: 20px;
      }

      .practice-item {
        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        padding: 20px;
        border-radius: 10px;
        border-left: 5px solid #28a745;
      }

      .practice-item h4 {
        color: #155724;
        margin-bottom: 10px;
        font-size: 1.1rem;
      }

      .practice-item p {
        color: #155724;
        margin: 0;
        opacity: 0.8;
      }

      /* Patterns Grid */
      .patterns-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 25px;
      }

      .pattern-card {
        background: #fff;
        border: 2px solid #e9ecef;
        border-radius: 12px;
        padding: 25px;
        transition: all 0.3s;
      }

      .pattern-card:hover {
        border-color: #667eea;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.1);
      }

      .pattern-card h3 {
        color: #2c3e50;
        margin-bottom: 15px;
        font-size: 1.3rem;
      }

      .pattern-card p {
        color: #6c757d;
        margin-bottom: 15px;
      }

      .pattern-example {
        background: #2d3748;
        color: #e2e8f0;
        border-radius: 8px;
        padding: 15px;
        overflow-x: auto;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.85rem;
      }

      .pattern-example pre {
        margin: 0;
        white-space: pre-wrap;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .docs-container {
          padding: 15px;
        }

        .docs-header {
          padding: 30px 15px;
        }

        .docs-header h1 {
          font-size: 2.2rem;
        }

        .docs-section {
          padding: 20px;
        }

        .docs-section h2 {
          font-size: 1.6rem;
        }

        .guard-types-grid,
        .interfaces-grid,
        .patterns-grid {
          grid-template-columns: 1fr;
        }

        .code-block,
        .pattern-example {
          font-size: 0.8rem;
          padding: 15px;
        }
      }
    `,
  ],
  imports: [CommonModule],
})
export class AuthGuardDocsComponent {}
