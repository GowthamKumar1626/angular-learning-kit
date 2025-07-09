import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService, User } from '../services/user.service';
import { CanDeactivateComponent } from '../guards/auth.guard';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [CommonModule, FormsModule],
})
export class ProfileComponent implements CanDeactivateComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  // Form data
  originalUser: User | null = null;
  profileForm = {
    name: '',
    email: '',
    role: 'user' as User['role'],
  };

  // Component state
  isEditing = false;
  _hasUnsavedChanges = false;
  isSaving = false;
  saveMessage = '';

  ngOnInit(): void {
    // Load current user data
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.originalUser = { ...currentUser };
      this.profileForm = {
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      };
    }
  }

  /**
   * Start editing mode
   */
  startEditing(): void {
    this.isEditing = true;
    this.saveMessage = '';
  }

  /**
   * Cancel editing and revert changes
   */
  cancelEditing(): void {
    if (this._hasUnsavedChanges) {
      const confirmCancel = confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmCancel) {
        return;
      }
    }

    // Revert to original values
    if (this.originalUser) {
      this.profileForm = {
        name: this.originalUser.name,
        email: this.originalUser.email,
        role: this.originalUser.role,
      };
    }

    this.isEditing = false;
    this._hasUnsavedChanges = false;
    this.saveMessage = '';
  }

  /**
   * Save profile changes
   */
  saveProfile(): void {
    if (!this.originalUser) return;

    this.isSaving = true;
    this.saveMessage = '';

    // Simulate saving with UserService
    const updates = {
      name: this.profileForm.name,
      email: this.profileForm.email,
      role: this.profileForm.role,
    };

    this.userService.updateUser(this.originalUser.id, updates).subscribe({
      next: (updatedUser) => {
        console.log('✅ Profile updated successfully:', updatedUser);

        // Update current user in service
        this.userService.setCurrentUser(updatedUser);

        // Update local data
        this.originalUser = { ...updatedUser };
        this._hasUnsavedChanges = false;
        this.isEditing = false;
        this.isSaving = false;
        this.saveMessage = 'Profile updated successfully!';

        // Clear success message after 3 seconds
        setTimeout(() => {
          this.saveMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Failed to update profile:', error);
        this.saveMessage = `Error: ${error.message}`;
        this.isSaving = false;
      },
    });
  }

  /**
   * Handle form input changes
   */
  onFormChange(): void {
    if (!this.originalUser) return;

    // Check if form values differ from original
    this._hasUnsavedChanges =
      this.profileForm.name !== this.originalUser.name ||
      this.profileForm.email !== this.originalUser.email ||
      this.profileForm.role !== this.originalUser.role;
  }

  /**
   * Navigate to other pages (for testing guards)
   */
  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  goToProtected(): void {
    this.router.navigate(['/protected']);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  // CanDeactivateComponent implementation
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this._hasUnsavedChanges) {
      const result = confirm(
        'You have unsaved changes to your profile. Are you sure you want to leave this page? Your changes will be lost.'
      );

      if (result) {
        console.log('✅ User confirmed leaving with unsaved changes');
      } else {
        console.log('🚫 User cancelled navigation to preserve changes');
      }

      return result;
    }

    return true;
  }

  hasUnsavedChanges(): boolean {
    return this._hasUnsavedChanges;
  }

  get currentUser(): User | null {
    return this.userService.getCurrentUser();
  }
}
