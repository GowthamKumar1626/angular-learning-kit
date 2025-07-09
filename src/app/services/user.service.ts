import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

// Interface for User data
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  createdAt: Date;
}

// @Injectable decorator makes this class available for dependency injection
@Injectable({
  providedIn: 'root', // This service is available application-wide (singleton)
})
// 'root' vs 'platform' vs 'any' in Angular
// 'root' means this service is available throughout the entire application as a singleton instance.
// 'platform' means the service is available across multiple Angular platforms (like web and mobile).
// 'any' means the service can be provided in any injector, but it is not a singleton.
//
// How it behaves when provided in is platform agnostic, meaning it can be used in any Angular application without platform-specific dependencies.
// UserService manages user data and authentication
// It provides methods to get, create, update, delete users, and manage authentication state
// It uses BehaviorSubject to allow components to reactively subscribe to user data changes
// It simulates API calls with delays to mimic real-world behavior
export class UserService {
  // Private data storage
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      isActive: true,
      createdAt: new Date('2024-02-20'),
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'moderator',
      isActive: false,
      createdAt: new Date('2024-03-10'),
    },
  ];

  // BehaviorSubject for reactive data
  private usersSubject = new BehaviorSubject<User[]>(this.users);
  public users$ = this.usersSubject.asObservable();

  // Current user state
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    console.log('UserService instantiated');
    // Simulate logged-in user
    this.setCurrentUser(this.users[0]);
  }

  // GET METHODS
  getAllUsers(): Observable<User[]> {
    // Simulate API call with delay
    return of(this.users).pipe(delay(500));
  }

  getUserById(id: number): Observable<User | undefined> {
    const user = this.users.find((u) => u.id === id);
    return of(user).pipe(delay(300));
  }

  getUserByEmail(email: string): Observable<User | undefined> {
    const user = this.users.find((u) => u.email === email);
    return of(user).pipe(delay(300));
  }

  getActiveUsers(): Observable<User[]> {
    const activeUsers = this.users.filter((u) => u.isActive);
    // Why not send the entire array immediately?
    // Simulating a delay to mimic real-world API behavior
    // This allows subscribers to handle loading states and UI updates gracefully
    // In a real application, this would be an HTTP call to fetch active users
    return of(activeUsers).pipe(delay(200));
  }

  getUsersByRole(role: User['role']): Observable<User[]> {
    const filteredUsers = this.users.filter((u) => u.role === role);
    return of(filteredUsers).pipe(delay(200));
  }

  // CRUD METHODS
  createUser(userData: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const newUser: User = {
      ...userData,
      id: Math.max(...this.users.map((u) => u.id)) + 1,
      createdAt: new Date(),
    };

    // Validate email uniqueness
    if (this.users.some((u) => u.email === newUser.email)) {
      return throwError(() => new Error('Email already exists'));
    }

    this.users.push(newUser);
    this.usersSubject.next([...this.users]);

    return of(newUser).pipe(delay(500));
  }

  updateUser(id: number, updates: Partial<User>): Observable<User> {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    // Check email uniqueness if updating email
    if (updates.email && updates.email !== this.users[userIndex].email) {
      if (this.users.some((u) => u.email === updates.email && u.id !== id)) {
        return throwError(() => new Error('Email already exists'));
      }
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.usersSubject.next([...this.users]);

    return of(this.users[userIndex]).pipe(delay(500));
  }

  deleteUser(id: number): Observable<boolean> {
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    this.users.splice(userIndex, 1);
    this.usersSubject.next([...this.users]);

    return of(true).pipe(delay(500));
  }

  toggleUserStatus(id: number): Observable<User> {
    const user = this.users.find((u) => u.id === id);

    if (!user) {
      return throwError(() => new Error('User not found'));
    }

    user.isActive = !user.isActive;
    this.usersSubject.next([...this.users]);

    return of(user).pipe(delay(300));
  }

  // AUTHENTICATION METHODS
  login(email: string, password: string): Observable<User> {
    // Simulate authentication (in real app, this would be an HTTP call)
    const user = this.users.find((u) => u.email === email && u.isActive);

    if (!user) {
      return throwError(() => new Error('Invalid credentials'));
    }

    this.setCurrentUser(user);
    return of(user).pipe(delay(1000));
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: User['role']): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === role || false;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // UTILITY METHODS
  getUserCount(): number {
    return this.users.length;
  }

  getActiveUserCount(): number {
    return this.users.filter((u) => u.isActive).length;
  }

  searchUsers(query: string): Observable<User[]> {
    const searchTerm = query.toLowerCase();
    const filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );

    return of(filteredUsers).pipe(delay(300));
  }

  // REACTIVE METHODS
  getUsersStream(): Observable<User[]> {
    return this.users$;
  }

  getCurrentUserStream(): Observable<User | null> {
    return this.currentUser$;
  }
}
