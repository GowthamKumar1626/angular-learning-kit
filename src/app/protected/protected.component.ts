import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-protected',
  template: `
    <div class="protected-container">
      <div class="protected-header">
        <h1>🔐 Protected Area</h1>
        <p>This page is protected by AuthGuard - authentication required</p>
      </div>

      <div class="user-info">
        <h2>Welcome, {{ currentUser?.name }}!</h2>
        <div class="user-details" *ngIf="currentUser">
          <div class="detail-item">
            <strong>Role:</strong>
            <span class="role-badge" [class]="'role-' + currentUser.role">
              {{ currentUser.role | titlecase }}
            </span>
          </div>
          <div class="detail-item">
            <strong>Email:</strong>
            <span>{{ currentUser.email }}</span>
          </div>
          <div class="detail-item">
            <strong>Status:</strong>
            <span class="status" [class.active]="currentUser.isActive">
              {{ currentUser.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="detail-item">
            <strong>Member Since:</strong>
            <span>{{ currentUser.createdAt | date : 'mediumDate' }}</span>
          </div>
        </div>
      </div>

      <div class="protected-content">
        <h2>Protected Features</h2>
        <div class="content-grid">
          <div class="content-card">
            <h3>📋 My Profile</h3>
            <p>View and edit your personal information</p>
            <button (click)="goToProfile()" class="btn btn-primary">
              View Profile
            </button>
          </div>

          <div class="content-card">
            <h3>📚 My Courses</h3>
            <p>Access your enrolled courses and materials</p>
            <button class="btn btn-primary">My Courses</button>
          </div>

          <div class="content-card">
            <h3>📊 Progress Reports</h3>
            <p>Track your learning progress and achievements</p>
            <button class="btn btn-primary">View Progress</button>
          </div>

          <div class="content-card" *ngIf="isAdminOrModerator">
            <h3>⚙️ Management Tools</h3>
            <p>Access management features based on your role</p>
            <button
              (click)="goToAdmin()"
              class="btn btn-secondary"
              *ngIf="currentUser?.role === 'admin'"
            >
              Admin Dashboard
            </button>
            <button
              class="btn btn-secondary"
              *ngIf="currentUser?.role === 'moderator'"
            >
              Moderator Panel
            </button>
          </div>
        </div>
      </div>

      <div class="guard-demo">
        <h2>🛡️ AuthGuard Demonstration</h2>
        <div class="demo-grid">
          <div class="demo-item">
            <h4>Access Status</h4>
            <div class="status-indicator success">✅ Access Granted</div>
            <p>You successfully passed the AuthGuard check!</p>
          </div>

          <div class="demo-item">
            <h4>Guard Type</h4>
            <div class="guard-type">
              <span class="guard-badge">CanActivate</span>
            </div>
            <p>This route uses the CanActivate guard interface</p>
          </div>

          <div class="demo-item">
            <h4>Protection Level</h4>
            <div class="protection-level">
              <span class="level-badge authentication"
                >Authentication Required</span
              >
            </div>
            <p>Any authenticated user can access this page</p>
          </div>
        </div>
      </div>

      <div class="navigation-demo">
        <h2>🧭 Test Other Protected Routes</h2>
        <div class="nav-buttons">
          <button (click)="goToAdmin()" class="btn btn-danger">
            👑 Admin Only (AdminGuard)
          </button>
          <button (click)="goToProfile()" class="btn btn-info">
            👤 Profile (AuthGuard + UnsavedChangesGuard)
          </button>
          <button (click)="logout()" class="btn btn-warning">
            🚪 Logout & Test Guard
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .protected-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      .protected-header {
        text-align: center;
        margin-bottom: 40px;
        padding: 30px;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        border-radius: 12px;
      }

      .protected-header h1 {
        margin: 0 0 10px 0;
        font-size: 2.5rem;
      }

      .user-info {
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 30px;
      }

      .user-info h2 {
        color: #28a745;
        margin-bottom: 20px;
      }

      .user-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 6px;
      }

      .role-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .role-badge.role-admin {
        background: #dc3545;
        color: white;
      }
      .role-badge.role-moderator {
        background: #ffc107;
        color: #212529;
      }
      .role-badge.role-user {
        background: #28a745;
        color: white;
      }

      .status.active {
        color: #28a745;
        font-weight: 600;
      }

      .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .content-card {
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 25px;
        text-align: center;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .content-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .demo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .demo-item {
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
      }

      .status-indicator {
        padding: 10px;
        border-radius: 8px;
        margin: 10px 0;
        font-weight: 600;
      }

      .status-indicator.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }

      .guard-badge,
      .level-badge {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .guard-badge {
        background: #007bff;
        color: white;
      }

      .level-badge.authentication {
        background: #28a745;
        color: white;
      }

      .nav-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 20px;
      }

      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      .btn-danger {
        background: #dc3545;
        color: white;
      }
      .btn-info {
        background: #17a2b8;
        color: white;
      }
      .btn-warning {
        background: #ffc107;
        color: #212529;
      }

      .btn:hover {
        transform: translateY(-2px);
        opacity: 0.9;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 1.8rem;
      }

      h3 {
        color: #495057;
        margin-bottom: 15px;
      }

      h4 {
        color: #6c757d;
        margin-bottom: 10px;
        font-size: 1rem;
      }

      .protected-content,
      .guard-demo,
      .navigation-demo {
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 30px;
      }
    `,
  ],
  imports: [CommonModule],
})
export class ProtectedComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  get currentUser(): User | null {
    return this.userService.getCurrentUser();
  }

  get isAdminOrModerator(): boolean {
    const user = this.currentUser;
    return user?.role === 'admin' || user?.role === 'moderator';
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
