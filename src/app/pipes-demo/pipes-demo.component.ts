import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import all our custom pipes
import {
  CapitalizePipe,
  TruncatePipe,
  MultiplyPipe,
  CustomCurrencyPipe,
  FilterPipe,
  SortPipe,
} from '../pipes/pure-pipes';

import {
  ImpureFilterPipe,
  TimeAgoPipe,
  RandomColorPipe,
  LiveSearchPipe,
  CounterPipe,
  AsyncDataPipe,
} from '../pipes/impure-pipes';

interface Student {
  id: number;
  name: string;
  course: string;
  grade: number;
  enrollmentDate: Date;
}

@Component({
  selector: 'app-pipes-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Pure Pipes
    CapitalizePipe,
    TruncatePipe,
    MultiplyPipe,
    CustomCurrencyPipe,
    FilterPipe,
    SortPipe,
    // Impure Pipes
    ImpureFilterPipe,
    TimeAgoPipe,
    RandomColorPipe,
    LiveSearchPipe,
    CounterPipe,
    AsyncDataPipe,
  ],
  template: `
    <div class="pipes-demo-container">
      <div class="demo-header">
        <h1>🔄 Pure vs Impure Pipes Demo</h1>
        <p>Understanding Angular Pipe Behavior and Performance</p>
      </div>

      <!-- Pure Pipes Section -->
      <section class="demo-section">
        <h2>✅ Pure Pipes (Default Behavior)</h2>
        <div class="info-card">
          <p>
            <strong>Pure pipes</strong> are only re-evaluated when Angular
            detects a pure change to the input value. They are more performant
            but less flexible.
          </p>
        </div>

        <div class="demo-grid">
          <!-- Capitalize Pipe -->
          <div class="demo-card">
            <h3>Capitalize Pipe</h3>
            <div class="input-group">
              <label>Text:</label>
              <input [(ngModel)]="textInput" placeholder="Enter text" />
            </div>
            <div class="result">
              <strong>Result:</strong> {{ textInput | capitalize }}
            </div>
            <div class="code-example">
              <code>{{ '{{ textInput | capitalize }}' }}</code>
            </div>
          </div>

          <!-- Truncate Pipe -->
          <div class="demo-card">
            <h3>Truncate Pipe</h3>
            <div class="input-group">
              <label>Text:</label>
              <input [(ngModel)]="longText" placeholder="Enter long text" />
            </div>
            <div class="input-group">
              <label>Limit:</label>
              <input type="number" [(ngModel)]="truncateLimit" min="1" />
            </div>
            <div class="result">
              <strong>Result:</strong>
              {{ longText | truncate : truncateLimit : '...' }}
            </div>
            <div class="code-example">
              <code>{{ '{{ longText | truncate:truncateLimit }}' }}</code>
            </div>
          </div>

          <!-- Multiply Pipe -->
          <div class="demo-card">
            <h3>Multiply Pipe</h3>
            <div class="input-group">
              <label>Number:</label>
              <input type="number" [(ngModel)]="numberInput" />
            </div>
            <div class="input-group">
              <label>Multiplier:</label>
              <input type="number" [(ngModel)]="multiplier" />
            </div>
            <div class="result">
              <strong>Result:</strong> {{ numberInput | multiply : multiplier }}
            </div>
            <div class="code-example">
              <code>{{ '{{ numberInput | multiply:multiplier }}' }}</code>
            </div>
          </div>

          <!-- Currency Pipe -->
          <div class="demo-card">
            <h3>Custom Currency Pipe</h3>
            <div class="input-group">
              <label>Amount:</label>
              <input type="number" [(ngModel)]="amount" step="0.01" />
            </div>
            <div class="result">
              <strong>USD:</strong> {{ amount | currency : '$' : 2 }}<br />
              <strong>EUR:</strong> {{ amount | currency : '€' : 2 }}<br />
              <strong>JPY:</strong> {{ amount | currency : '¥' : 0 }}
            </div>
            <div class="code-example">
              <code>{{ '{{ amount | currency:symbol:digits }}' }}</code>
            </div>
          </div>
        </div>

        <!-- Filter and Sort with Arrays -->
        <div class="array-demo">
          <h3>Array Manipulation with Pure Pipes</h3>
          <div class="controls">
            <div class="input-group">
              <label>Search Students:</label>
              <input
                [(ngModel)]="pureSearchText"
                placeholder="Search by name or course"
              />
            </div>
            <div class="input-group">
              <label>Sort by:</label>
              <select [(ngModel)]="sortProperty">
                <option value="name">Name</option>
                <option value="course">Course</option>
                <option value="grade">Grade</option>
              </select>
              <label>
                <input type="checkbox" [(ngModel)]="sortReverse" /> Reverse
              </label>
            </div>
          </div>

          <div class="students-grid">
            <div
              class="student-card"
              *ngFor="
                let student of students
                  | filter : pureSearchText : 'name'
                  | sort : sortProperty : sortReverse
              "
            >
              <h4>{{ student.name | capitalize }}</h4>
              <p><strong>Course:</strong> {{ student.course }}</p>
              <p><strong>Grade:</strong> {{ student.grade }}%</p>
              <p>
                <strong>Enrolled:</strong>
                {{ student.enrollmentDate | date : 'shortDate' }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Impure Pipes Section -->
      <section class="demo-section">
        <h2>⚡ Impure Pipes (pure: false)</h2>
        <div class="info-card warning">
          <p>
            <strong>Impure pipes</strong> are re-evaluated on every change
            detection cycle. They are more flexible but can impact performance.
          </p>
        </div>

        <div class="demo-grid">
          <!-- Time Ago Pipe -->
          <div class="demo-card">
            <h3>Time Ago Pipe (Live Updates)</h3>
            <div class="result">
              <strong>Page loaded:</strong> {{ pageLoadTime | timeAgo }}<br />
              <strong>Static date:</strong> {{ staticDate | timeAgo }}<br />
              <strong>Recent time:</strong> {{ recentTime | timeAgo }}
            </div>
            <div class="code-example">
              <code>{{ '{{ date | timeAgo }}' }}</code>
            </div>
            <p class="note">⏰ This updates automatically every few seconds</p>
          </div>

          <!-- Random Color Pipe -->
          <div class="demo-card">
            <h3>Random Color Pipe</h3>
            <div class="result">
              <span [style.color]="'random' | randomColor"
                >Random Color Text</span
              ><br />
              <span
                [style.background-color]="'background' | randomColor"
                [style.color]="'white'"
                class="color-demo"
              >
                Random Background
              </span>
            </div>
            <div class="code-example">
              <code>{{ '{{ value | randomColor }}' }}</code>
            </div>
            <p class="note">🎨 Colors change on every change detection</p>
          </div>

          <!-- Counter Pipe -->
          <div class="demo-card">
            <h3>Counter Pipe (Stateful)</h3>
            <div class="result">
              {{ 'Hello' | counter }}<br />
              {{ 'World' | counter }}<br />
              {{ 'Angular' | counter }}
            </div>
            <div class="code-example">
              <code>{{ '{{ value | counter }}' }}</code>
            </div>
            <button (click)="triggerChangeDetection()" class="demo-button">
              Trigger Change Detection
            </button>
          </div>

          <!-- Async Data Pipe -->
          <div class="demo-card">
            <h3>Async Data Pipe</h3>
            <div class="result">
              <strong>User Data:</strong> {{ 'user123' | asyncData }}<br />
              <strong>Config:</strong> {{ 'app-config' | asyncData }}<br />
              <strong>Stats:</strong> {{ 'dashboard-stats' | asyncData }}
            </div>
            <div class="code-example">
              <code>{{ '{{ key | asyncData }}' }}</code>
            </div>
            <p class="note">📡 Simulates async data loading</p>
          </div>
        </div>

        <!-- Live Search Demo -->
        <div class="array-demo">
          <h3>Live Search with Impure Pipe</h3>
          <div class="controls">
            <div class="input-group">
              <label>Live Search Students:</label>
              <input
                [(ngModel)]="impureSearchText"
                placeholder="Search updates in real-time"
              />
            </div>
          </div>

          <div class="students-grid">
            <div
              class="student-card"
              *ngFor="
                let student of students | liveSearch : impureSearchText : 'name'
              "
            >
              <h4>{{ student.name | capitalize }}</h4>
              <p><strong>Course:</strong> {{ student.course }}</p>
              <p><strong>Grade:</strong> {{ student.grade }}%</p>
              <p>
                <strong>Status:</strong>
                <span [style.color]="student.id | randomColor">
                  {{ student.id | counter }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Performance Comparison -->
      <section class="demo-section">
        <h2>⚖️ Performance Comparison</h2>
        <div class="comparison-grid">
          <div class="comparison-card">
            <h3>Pure Pipes</h3>
            <ul class="pros-cons">
              <li class="pro">✅ High Performance</li>
              <li class="pro">✅ Cached Results</li>
              <li class="pro">✅ Only re-run when input changes</li>
              <li class="pro">✅ Memory Efficient</li>
              <li class="con">❌ Cannot detect internal object changes</li>
              <li class="con">❌ Not suitable for time-dependent data</li>
            </ul>
            <div class="performance-demo">
              <strong>Pure Filter (cached):</strong>
              <div>
                {{
                  students
                    | filter : pureSearchText : 'name'
                    | slice : 0 : 1
                    | json
                }}
              </div>
            </div>
          </div>

          <div class="comparison-card">
            <h3>Impure Pipes</h3>
            <ul class="pros-cons">
              <li class="pro">✅ Always up-to-date</li>
              <li class="pro">✅ Can handle dynamic data</li>
              <li class="pro">✅ Suitable for real-time updates</li>
              <li class="pro">✅ Can maintain internal state</li>
              <li class="con">❌ Performance overhead</li>
              <li class="con">❌ Runs on every change detection</li>
            </ul>
            <div class="performance-demo">
              <strong>Impure Filter (always fresh):</strong>
              <div>
                {{
                  students
                    | impureFilter : impureSearchText : 'name'
                    | slice : 0 : 1
                    | json
                }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="demo-section">
        <h2>💡 Best Practices</h2>
        <div class="best-practices">
          <div class="practice-item">
            <h4>🎯 Use Pure Pipes by Default</h4>
            <p>
              Pure pipes are more performant and should be your first choice for
              most transformations.
            </p>
          </div>
          <div class="practice-item">
            <h4>⏰ Use Impure Pipes for Time-Dependent Data</h4>
            <p>
              When you need real-time updates or depend on external state
              changes.
            </p>
          </div>
          <div class="practice-item">
            <h4>🔄 Avoid Complex Logic in Impure Pipes</h4>
            <p>Keep impure pipe logic simple to minimize performance impact.</p>
          </div>
          <div class="practice-item">
            <h4>📊 Monitor Performance</h4>
            <p>
              Use Angular DevTools to monitor how often your pipes are being
              called.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .pipes-demo-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
      }

      .demo-header {
        text-align: center;
        margin-bottom: 40px;
        padding: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
      }

      .demo-header h1 {
        margin: 0 0 10px 0;
        font-size: 2.5rem;
      }

      .demo-section {
        margin-bottom: 40px;
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .demo-section h2 {
        color: #2c3e50;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid #667eea;
      }

      .info-card {
        background: #e3f2fd;
        border-left: 4px solid #2196f3;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 4px;
      }

      .info-card.warning {
        background: #fff3e0;
        border-left-color: #ff9800;
      }

      .demo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .demo-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        transition: transform 0.2s;
      }

      .demo-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .demo-card h3 {
        color: #495057;
        margin-bottom: 15px;
        font-size: 1.2rem;
      }

      .input-group {
        margin-bottom: 10px;
      }

      .input-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #495057;
      }

      .input-group input,
      .input-group select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 14px;
      }

      .input-group input[type='checkbox'] {
        width: auto;
        margin-right: 8px;
      }

      .result {
        background: white;
        padding: 12px;
        border-radius: 4px;
        margin: 10px 0;
        border-left: 3px solid #28a745;
        min-height: 40px;
      }

      .code-example {
        background: #2d3748;
        color: #e2e8f0;
        padding: 8px 12px;
        border-radius: 4px;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.85rem;
        margin-top: 10px;
      }

      .array-demo {
        margin-top: 30px;
        padding-top: 30px;
        border-top: 1px solid #e9ecef;
      }

      .controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
      }

      .students-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
      }

      .student-card {
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 15px;
        transition: all 0.2s;
      }

      .student-card:hover {
        border-color: #667eea;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
      }

      .student-card h4 {
        margin: 0 0 10px 0;
        color: #2c3e50;
      }

      .student-card p {
        margin: 5px 0;
        font-size: 0.9rem;
        color: #6c757d;
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
      }

      .comparison-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
      }

      .pros-cons {
        list-style: none;
        padding: 0;
      }

      .pros-cons li {
        padding: 5px 0;
        font-size: 0.9rem;
      }

      .pro {
        color: #28a745;
      }

      .con {
        color: #dc3545;
      }

      .performance-demo {
        background: white;
        padding: 10px;
        border-radius: 4px;
        margin-top: 15px;
        font-size: 0.85rem;
        border-left: 3px solid #667eea;
      }

      .best-practices {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }

      .practice-item {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        border-radius: 6px;
        padding: 15px;
      }

      .practice-item h4 {
        margin: 0 0 10px 0;
        color: #155724;
      }

      .practice-item p {
        margin: 0;
        color: #155724;
        font-size: 0.9rem;
      }

      .note {
        font-size: 0.8rem;
        color: #6c757d;
        font-style: italic;
        margin-top: 10px;
      }

      .color-demo {
        padding: 8px 12px;
        border-radius: 4px;
        display: inline-block;
        margin: 5px 0;
      }

      .demo-button {
        background: #667eea;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
        transition: background-color 0.2s;
      }

      .demo-button:hover {
        background: #5a6fd8;
      }

      @media (max-width: 768px) {
        .demo-grid {
          grid-template-columns: 1fr;
        }

        .comparison-grid {
          grid-template-columns: 1fr;
        }

        .controls {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class PipesDemoComponent {
  // Component properties for demonstrations
  textInput = 'hello world';
  longText =
    'This is a very long text that should be truncated when it exceeds the specified limit to demonstrate the truncate pipe functionality.';
  truncateLimit = 50;
  numberInput = 10;
  multiplier = 3;
  amount = 99.99;

  // Search properties
  pureSearchText = '';
  impureSearchText = '';
  sortProperty = 'name';
  sortReverse = false;

  // Time-related properties
  pageLoadTime = new Date();
  staticDate = new Date('2024-01-01');
  recentTime = new Date(Date.now() - 30000); // 30 seconds ago

  // Sample data
  students: Student[] = [
    {
      id: 1,
      name: 'alice johnson',
      course: 'Angular Development',
      grade: 92,
      enrollmentDate: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'bob smith',
      course: 'React Fundamentals',
      grade: 88,
      enrollmentDate: new Date('2024-02-20'),
    },
    {
      id: 3,
      name: 'carol davis',
      course: 'Vue.js Basics',
      grade: 95,
      enrollmentDate: new Date('2024-01-30'),
    },
    {
      id: 4,
      name: 'david wilson',
      course: 'Angular Development',
      grade: 85,
      enrollmentDate: new Date('2024-03-05'),
    },
    {
      id: 5,
      name: 'emma brown',
      course: 'TypeScript Advanced',
      grade: 94,
      enrollmentDate: new Date('2024-02-10'),
    },
    {
      id: 6,
      name: 'frank miller',
      course: 'React Fundamentals',
      grade: 87,
      enrollmentDate: new Date('2024-03-15'),
    },
  ];

  triggerChangeDetection() {
    // This method doesn't need to do anything specific
    // Just calling it will trigger change detection
    console.log('Change detection triggered manually');
  }
}
