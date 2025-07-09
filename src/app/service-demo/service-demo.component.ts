import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-service-demo',
  templateUrl: './service-demo.component.html',
  styleUrl: './service-demo.component.css',
  imports: [CommonModule, FormsModule],
})
export class ServiceDemoComponent implements OnInit, OnDestroy {
  // Why use of Subject for cleanup?
  // Using a Subject allows us to easily manage subscriptions and prevent memory leaks
  // by emitting a value when the component is destroyed, which will complete all subscriptions
  private destroy$ = new Subject<void>();

  // Three ways to inject services in Angular:

  // 1. Constructor injection (traditional approach)
  constructor(private userService: UserService) {}

  // 2. Using inject() function (modern approach)
  // private userService = inject(UserService);

  // Component properties
  users: User[] = [];
  currentUser: User | null = null;
  activeUsers: User[] = [];
  isLoading = false;
  error: string | null = null;

  // Form data for creating new user
  newUser = {
    name: '',
    email: '',
    role: 'user' as User['role'],
    isActive: true,
  };

  // Search functionality
  searchQuery = '';
  searchResults: User[] = [];

  ngOnInit(): void {
    this.loadUsers();
    this.subscribeToUserChanges();
    this.subscribeToCurrentUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // DEMONSTRATION OF SERVICE USAGE

  /**
   * Load all users using the service
   */
  loadUsers(): void {
    this.isLoading = true;
    this.error = null;

    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
          console.log('Users loaded:', users);
        },
        error: (error) => {
          this.error = error.message;
          this.isLoading = false;
          console.error('Error loading users:', error);
        },
      });
  }

  /**
   * Subscribe to reactive user stream
   * This demonstrates how services can provide reactive data
   */
  subscribeToUserChanges(): void {
    this.userService
      .getUsersStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        console.log('Users updated via stream:', users);
      });
  }

  /**
   * Subscribe to current user changes
   */
  subscribeToCurrentUser(): void {
    this.userService
      .getCurrentUserStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        console.log('Current user changed:', user);
      });
  }

  /**
   * Load only active users
   */
  loadActiveUsers(): void {
    this.userService
      .getActiveUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.activeUsers = users;
        console.log('Active users:', users);
      });
  }

  /**
   * Create a new user
   */
  createUser(): void {
    if (!this.newUser.name || !this.newUser.email) {
      this.error = 'Name and email are required';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.userService
      .createUser(this.newUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          console.log('User created:', user);
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.isLoading = false;
        },
      });
  }

  /**
   * Toggle user active status
   */
  toggleUserStatus(user: User): void {
    this.userService
      .toggleUserStatus(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          console.log('User status toggled:', updatedUser);
        },
        error: (error) => {
          this.error = error.message;
        },
      });
  }

  /**
   * Delete a user
   */
  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.userService
        .deleteUser(user.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('User deleted:', user.name);
          },
          error: (error) => {
            this.error = error.message;
          },
        });
    }
  }

  /**
   * Search users
   */
  searchUsers(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }

    this.userService
      .searchUsers(this.searchQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        this.searchResults = results;
        console.log('Search results:', results);
      });
  }

  /**
   * Login as a user (demo)
   */
  loginAsUser(user: User): void {
    this.userService.setCurrentUser(user);
  }

  /**
   * Logout
   */
  logout(): void {
    this.userService.logout();
  }

  /**
   * Reset the new user form
   */
  private resetForm(): void {
    this.newUser = {
      name: '',
      email: '',
      role: 'user',
      isActive: true,
    };
  }

  /**
   * Get user count using service utility method
   */
  get userCount(): number {
    return this.userService.getUserCount();
  }

  /**
   * Get active user count using service utility method
   */
  get activeUserCount(): number {
    return this.userService.getActiveUserCount();
  }

  /**
   * Check if current user is admin
   */
  get isCurrentUserAdmin(): boolean {
    return this.userService.isAdmin();
  }

  /**
   * Check if user is logged in
   */
  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  /**
   * Track function for ngFor to improve performance
   */
  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
