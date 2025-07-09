import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, FormsModule],
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  // Login form data
  loginForm = {
    email: '',
    password: 'password123', // Demo password
  };

  // Component state
  isLoading = false;
  error: string | null = null;
  returnUrl = '/dashboard';

  // Available demo users for quick login
  demoUsers: User[] = [];

  ngOnInit(): void {
    // Get return URL from query params
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    console.log('🔄 Login page loaded, return URL:', this.returnUrl);

    // Load demo users for quick login
    this.loadDemoUsers();

    // Check if already logged in
    if (this.userService.isLoggedIn()) {
      console.log('✅ User already logged in, redirecting...');
      this.router.navigate([this.returnUrl]);
    }
  }

  /**
   * Load demo users for quick login buttons
   */
  loadDemoUsers(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.demoUsers = users.filter((user) => user.isActive);
    });
  }

  /**
   * Handle login form submission
   */
  onLogin(): void {
    if (!this.loginForm.email) {
      this.error = 'Email is required';
      return;
    }

    this.isLoading = true;
    this.error = null;

    console.log('🔐 Attempting login for:', this.loginForm.email);

    // Simulate login process
    this.userService
      .login(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: (user) => {
          console.log('✅ Login successful:', user.name);
          this.isLoading = false;

          // Redirect to return URL or dashboard
          console.log('🔄 Redirecting to:', this.returnUrl);
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          console.error('❌ Login failed:', error.message);
          this.error = error.message;
          this.isLoading = false;
        },
      });
  }

  /**
   * Quick login with demo user
   */
  quickLogin(user: User): void {
    console.log('⚡ Quick login as:', user.name);
    this.loginForm.email = user.email;
    this.onLogin();
  }

  /**
   * Navigate to registration (demo)
   */
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /**
   * Demo logout (if somehow already logged in)
   */
  logout(): void {
    this.userService.logout();
    console.log('👋 Logged out');
  }

  /**
   * Check if user is currently logged in
   */
  get isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  /**
   * Get current user
   */
  get currentUser(): User | null {
    return this.userService.getCurrentUser();
  }
}
