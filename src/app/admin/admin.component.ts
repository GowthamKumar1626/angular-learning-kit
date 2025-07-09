import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-admin',
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>👑 Admin Dashboard</h1>
        <p>
          This page is protected by AdminGuard - only admin users can access it
        </p>
      </div>

      <div class="current-user">
        <h2>Current User</h2>
        <div class="user-card" *ngIf="currentUser">
          <strong>{{ currentUser.name }}</strong>
          <span class="role-badge role-admin">{{
            currentUser.role | titlecase
          }}</span>
          <span class="email">{{ currentUser.email }}</span>
        </div>
      </div>

      <div class="admin-features">
        <h2>Admin-Only Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <h3>👥 User Management</h3>
            <p>Create, edit, and delete user accounts</p>
            <button class="btn btn-primary">Manage Users</button>
          </div>

          <div class="feature-card">
            <h3>📊 System Analytics</h3>
            <p>View detailed system usage and performance metrics</p>
            <button class="btn btn-primary">View Analytics</button>
          </div>

          <div class="feature-card">
            <h3>⚙️ System Settings</h3>
            <p>Configure system-wide settings and preferences</p>
            <button class="btn btn-primary">System Config</button>
          </div>

          <div class="feature-card">
            <h3>🔐 Security Management</h3>
            <p>Manage security policies and access controls</p>
            <button class="btn btn-primary">Security Settings</button>
          </div>
        </div>
      </div>

      <div class="guard-info">
        <h2>🛡️ Guard Information</h2>
        <div class="info-panel">
          <p><strong>Protected by:</strong> AdminGuard</p>
          <p><strong>Required Role:</strong> admin</p>
          <p>
            <strong>Access Logic:</strong> User must be authenticated and have
            'admin' role
          </p>
          <p>
            <strong>Redirect on Failure:</strong> /login (if not authenticated)
            or /unauthorized (if not admin)
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      .admin-header {
        text-align: center;
        margin-bottom: 40px;
        padding: 30px;
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        color: white;
        border-radius: 12px;
      }

      .admin-header h1 {
        margin: 0 0 10px 0;
        font-size: 2.5rem;
      }

      .current-user {
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 30px;
      }

      .user-card {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .role-badge {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .role-badge.role-admin {
        background: #dc3545;
        color: white;
      }

      .email {
        color: #6c757d;
        font-size: 0.9rem;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .feature-card {
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 25px;
        text-align: center;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .feature-card h3 {
        color: #2c3e50;
        margin-bottom: 15px;
      }

      .feature-card p {
        color: #6c757d;
        margin-bottom: 20px;
        line-height: 1.5;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary {
        background: #dc3545;
        color: white;
      }

      .btn-primary:hover {
        background: #c82333;
        transform: translateY(-1px);
      }

      .guard-info {
        background: #fff;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        padding: 25px;
        margin-top: 30px;
      }

      .info-panel {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #dc3545;
      }

      .info-panel p {
        margin: 8px 0;
        color: #495057;
      }

      h2 {
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 1.8rem;
      }
    `,
  ],
  imports: [CommonModule],
})
export class AdminComponent {
  private userService = inject(UserService);

  get currentUser(): User | null {
    return this.userService.getCurrentUser();
  }
}
