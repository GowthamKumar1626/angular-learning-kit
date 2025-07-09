import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="error-icon">🚫</div>
        <h1>Access Denied</h1>
        <p class="error-message">
          You don't have permission to access this resource.
        </p>

        <div class="user-info" *ngIf="currentUser">
          <h3>Current User Information:</h3>
          <div class="user-details">
            <p><strong>Name:</strong> {{ currentUser.name }}</p>
            <p>
              <strong>Role:</strong>
              <span class="role-badge" [class]="'role-' + currentUser.role">
                {{ currentUser.role | titlecase }}
              </span>
            </p>
            <p>
              <strong>Status:</strong>
              <span class="status" [class.active]="currentUser.isActive">
                {{ currentUser.isActive ? 'Active' : 'Inactive' }}
              </span>
            </p>
          </div>
        </div>

        <div class="error-details">
          <h3>Possible Reasons:</h3>
          <ul>
            <li>Your account doesn't have the required role/permissions</li>
            <li>
              You tried to access an admin-only area without admin privileges
            </li>
            <li>Your account may have been deactivated</li>
            <li>The resource requires a different authentication level</li>
          </ul>
        </div>

        <div class="suggested-actions">
          <h3>What can you do?</h3>
          <div class="action-buttons">
            <button (click)="goHome()" class="btn btn-primary">
              🏠 Go to Dashboard
            </button>

            <button (click)="goToLogin()" class="btn btn-secondary">
              🔐 Login as Different User
            </button>

            <button (click)="goBack()" class="btn btn-info">⬅️ Go Back</button>
          </div>
        </div>

        <div class="guard-info">
          <h3>🛡️ Guard Information</h3>
          <div class="info-panel">
            <p>This page is typically shown when:</p>
            <ul>
              <li>
                <strong>AdminGuard</strong> blocks access (non-admin users)
              </li>
              <li>
                <strong>RoleGuard</strong> blocks access (insufficient role)
              </li>
              <li>Custom authorization logic fails</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .unauthorized-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      .unauthorized-content {
        background: white;
        border-radius: 16px;
        padding: 40px;
        max-width: 600px;
        width: 100%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        animation: slideUp 0.6s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .error-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        display: block;
      }

      h1 {
        color: #dc3545;
        font-size: 2.5rem;
        margin-bottom: 15px;
        font-weight: 600;
      }

      .error-message {
        color: #6c757d;
        font-size: 1.2rem;
        margin-bottom: 30px;
        line-height: 1.5;
      }

      .user-info {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 25px;
        text-align: left;
      }

      .user-info h3 {
        color: #495057;
        margin-bottom: 15px;
        text-align: center;
      }

      .user-details p {
        margin: 8px 0;
        color: #495057;
        display: flex;
        align-items: center;
        gap: 10px;
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

      .status:not(.active) {
        color: #dc3545;
        font-weight: 600;
      }

      .error-details,
      .suggested-actions,
      .guard-info {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 25px;
        text-align: left;
      }

      .error-details h3,
      .suggested-actions h3,
      .guard-info h3 {
        color: #495057;
        margin-bottom: 15px;
        text-align: center;
      }

      .error-details ul,
      .guard-info ul {
        color: #6c757d;
        line-height: 1.6;
        margin: 0;
        padding-left: 20px;
      }

      .error-details li,
      .guard-info li {
        margin: 8px 0;
      }

      .action-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .btn {
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .btn-primary {
        background: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background: #0056b3;
        transform: translateY(-2px);
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background: #5a6268;
        transform: translateY(-2px);
      }

      .btn-info {
        background: #17a2b8;
        color: white;
      }

      .btn-info:hover {
        background: #138496;
        transform: translateY(-2px);
      }

      .info-panel {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 6px;
        padding: 15px;
        border-left: 4px solid #dc3545;
      }

      .info-panel p {
        margin: 0 0 10px 0;
        color: #495057;
      }

      .info-panel ul {
        margin: 0;
        color: #6c757d;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .unauthorized-container {
          padding: 15px;
        }

        .unauthorized-content {
          padding: 30px 20px;
        }

        h1 {
          font-size: 2rem;
        }

        .error-message {
          font-size: 1rem;
        }

        .action-buttons {
          flex-direction: column;
          align-items: center;
        }

        .btn {
          width: 100%;
          max-width: 250px;
        }
      }
    `,
  ],
  imports: [CommonModule],
})
export class UnauthorizedComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  get currentUser(): User | null {
    return this.userService.getCurrentUser();
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goBack(): void {
    window.history.back();
  }
}
