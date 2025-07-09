import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pipes-docs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="docs-container">
      <div class="docs-header">
        <h1>🔄 Angular Pipes Implementation Guide</h1>
        <p>Complete guide to implementing Pure and Impure Pipes</p>
      </div>

      <!-- What are Pipes -->
      <section class="docs-section">
        <h2>What are Angular Pipes?</h2>
        <div class="content-card">
          <p>
            <strong>Pipes</strong> are simple functions that accept an input
            value and return a transformed value. They are used in templates to
            transform data for display without changing the original data.
          </p>

          <div class="key-features">
            <h3>Key Features:</h3>
            <ul>
              <li>
                <strong>Template-based:</strong> Used directly in templates with
                the pipe operator (|)
              </li>
              <li>
                <strong>Chainable:</strong> Multiple pipes can be chained
                together
              </li>
              <li>
                <strong>Parameterizable:</strong> Can accept parameters to
                customize behavior
              </li>
              <li>
                <strong>Pure/Impure:</strong> Control when the pipe is
                re-evaluated
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Pure vs Impure -->
      <section class="docs-section">
        <h2>Pure vs Impure Pipes</h2>
        <div class="comparison-grid">
          <div class="comparison-card pure">
            <h3>🟢 Pure Pipes (Default)</h3>
            <div class="code-block">
              <pre><code>&#64;Pipe(&#123;
  name: 'capitalize',
  pure: true // Default value
&#125;)</code></pre>
            </div>
            <div class="features">
              <h4>Characteristics:</h4>
              <ul>
                <li>Only re-executed when input value changes</li>
                <li>Treats inputs as immutable</li>
                <li>Better performance</li>
                <li>Stateless by design</li>
                <li>Results are cached</li>
              </ul>
            </div>
            <div class="use-cases">
              <h4>Use Cases:</h4>
              <ul>
                <li>String transformations</li>
                <li>Number formatting</li>
                <li>Date formatting</li>
                <li>Static data transformations</li>
              </ul>
            </div>
          </div>

          <div class="comparison-card impure">
            <h3>🟡 Impure Pipes</h3>
            <div class="code-block">
              <pre><code>&#64;Pipe(&#123;
  name: 'timeAgo',
  pure: false // Explicitly set to false
&#125;)</code></pre>
            </div>
            <div class="features">
              <h4>Characteristics:</h4>
              <ul>
                <li>Re-executed on every change detection cycle</li>
                <li>Can detect internal object changes</li>
                <li>Higher performance cost</li>
                <li>Can maintain internal state</li>
                <li>Always returns fresh results</li>
              </ul>
            </div>
            <div class="use-cases">
              <h4>Use Cases:</h4>
              <ul>
                <li>Time-dependent data</li>
                <li>Array filtering with mutable arrays</li>
                <li>Real-time data updates</li>
                <li>External API dependent transformations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Implementation Examples -->
      <section class="docs-section">
        <h2>Implementation Examples</h2>

        <!-- Pure Pipe Example -->
        <div class="example-card">
          <h3>Pure Pipe Implementation</h3>
          <div class="code-block">
            <pre><code>import &#123; Pipe, PipeTransform &#125; from '&#64;angular/core';

&#64;Pipe(&#123;
  name: 'capitalize',
  pure: true // Optional, as this is the default
&#125;)
export class CapitalizePipe implements PipeTransform &#123;
  transform(value: string): string &#123;
    if (!value) return '';
    
    console.log('CapitalizePipe executed for:', value);
    
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  &#125;
&#125;

// Usage in template:
// &lt;p&gt;Hello World: 'hello world' | capitalize&lt;/p&gt;
// Output: "Hello world"</code></pre>
          </div>
          <div class="explanation">
            <p><strong>Key Points:</strong></p>
            <ul>
              <li>Only runs when the input string changes</li>
              <li>Pure function - same input always produces same output</li>
              <li>High performance due to caching</li>
            </ul>
          </div>
        </div>

        <!-- Impure Pipe Example -->
        <div class="example-card">
          <h3>Impure Pipe Implementation</h3>
          <div class="code-block">
            <pre><code>import &#123; Pipe, PipeTransform &#125; from '&#64;angular/core';

&#64;Pipe(&#123;
  name: 'timeAgo',
  pure: false // Must be explicitly set to false
&#125;)
export class TimeAgoPipe implements PipeTransform &#123;
  transform(value: Date | string): string &#123;
    if (!value) return '';
    
    const date = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    console.log('TimeAgoPipe executed at:', now.toLocaleTimeString());
    
    if (diffInSeconds &lt; 60) &#123;
      return 'diffInSeconds + " seconds ago"';
    &#125; else if (diffInSeconds &lt; 3600) &#123;
      const minutes = Math.floor(diffInSeconds / 60);
      return 'minutes + " minute" + (minutes &gt; 1 ? "s" : "") + " ago"';
    &#125;
    // ... more time calculations
    
    return 'Some time ago';
  &#125;
&#125;

// Usage in template:
// &lt;p&gt;Time: postDate | timeAgo&lt;/p&gt;
// Output: "5 minutes ago" (updates in real-time)</code></pre>
          </div>
          <div class="explanation">
            <p><strong>Key Points:</strong></p>
            <ul>
              <li>Runs on every change detection cycle</li>
              <li>Provides real-time updates</li>
              <li>
                Higher performance cost but necessary for time-dependent data
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Advanced Techniques -->
      <section class="docs-section">
        <h2>Advanced Pipe Techniques</h2>

        <!-- Parameterized Pipes -->
        <div class="technique-card">
          <h3>1. Parameterized Pipes</h3>
          <div class="code-block">
            <pre><code>&#64;Pipe(&#123; name: 'truncate' &#125;)
export class TruncatePipe implements PipeTransform &#123;
  transform(value: string, limit: number = 50, suffix: string = '...'): string &#123;
    if (!value || value.length <= limit) return value;
    return value.substring(0, limit) + suffix;
  &#125;
&#125;

// Usage:
// &lt;p&gt;Truncated: text | truncate:30:'---'&lt;/p&gt;</code></pre>
          </div>
        </div>

        <!-- Stateful Impure Pipes -->
        <div class="technique-card">
          <h3>2. Stateful Impure Pipes</h3>
          <div class="code-block">
            <pre><code>&#64;Pipe(&#123; name: 'counter', pure: false &#125;)
export class CounterPipe implements PipeTransform &#123;
  private callCount = 0;
  
  transform(value: any): string &#123;
    this.callCount++;
    return 'value + " (called " + this.callCount + " times)"';
  &#125;
&#125;</code></pre>
          </div>
        </div>

        <!-- Array Filtering -->
        <div class="technique-card">
          <h3>3. Array Filtering (Pure vs Impure)</h3>
          <div class="code-block">
            <pre><code>// Pure Filter - Only works with immutable array changes
&#64;Pipe(&#123; name: 'pureFilter' &#125;)
export class PureFilterPipe implements PipeTransform &#123;
  transform(items: any[], searchText: string): any[] &#123;
    if (!items || !searchText) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  &#125;
&#125;

// Impure Filter - Works with mutable array changes
&#64;Pipe(&#123; name: 'impureFilter', pure: false &#125;)
export class ImpureFilterPipe implements PipeTransform &#123;
  transform(items: any[], searchText: string): any[] &#123;
    if (!items || !searchText) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  &#125;
&#125;</code></pre>
          </div>
        </div>
      </section>

      <!-- Performance Considerations -->
      <section class="docs-section">
        <h2>Performance Considerations</h2>
        <div class="performance-grid">
          <div class="performance-card">
            <h3>⚡ Pure Pipe Performance</h3>
            <ul>
              <li>
                <strong>Caching:</strong> Results are cached based on input
              </li>
              <li>
                <strong>Change Detection:</strong> Only runs when input changes
              </li>
              <li><strong>Memory:</strong> Lower memory usage</li>
              <li>
                <strong>Best for:</strong> Simple transformations, formatting
              </li>
            </ul>
            <div class="performance-tip">
              <strong>💡 Tip:</strong> Use pure pipes for most transformations
              to maximize performance.
            </div>
          </div>

          <div class="performance-card">
            <h3>🔥 Impure Pipe Performance</h3>
            <ul>
              <li>
                <strong>Execution:</strong> Runs on every change detection
              </li>
              <li><strong>Cost:</strong> Higher CPU usage</li>
              <li><strong>Memory:</strong> No caching, fresh calculations</li>
              <li><strong>Best for:</strong> Time-dependent, real-time data</li>
            </ul>
            <div class="performance-warning">
              <strong>⚠️ Warning:</strong> Use impure pipes sparingly and
              optimize their logic.
            </div>
          </div>
        </div>
      </section>

      <!-- Best Practices -->
      <section class="docs-section">
        <h2>Best Practices</h2>
        <div class="best-practices">
          <div class="practice-item">
            <h4>🎯 Default to Pure Pipes</h4>
            <p>
              Start with pure pipes and only use impure pipes when necessary for
              real-time updates or dynamic data.
            </p>
          </div>

          <div class="practice-item">
            <h4>🚀 Optimize Impure Pipe Logic</h4>
            <p>
              Keep impure pipe logic as simple and fast as possible since they
              run frequently.
            </p>
          </div>

          <div class="practice-item">
            <h4>📊 Use OnPush Change Detection</h4>
            <p>
              Combine with OnPush change detection strategy to minimize
              unnecessary pipe executions.
            </p>
          </div>

          <div class="practice-item">
            <h4>🔄 Avoid Complex Operations</h4>
            <p>
              Move complex operations to services and use pipes only for simple
              transformations.
            </p>
          </div>

          <div class="practice-item">
            <h4>🧪 Test Pipe Behavior</h4>
            <p>
              Write unit tests to ensure pipes behave correctly with different
              inputs and edge cases.
            </p>
          </div>

          <div class="practice-item">
            <h4>📈 Monitor Performance</h4>
            <p>
              Use Angular DevTools to monitor how often your pipes are being
              called.
            </p>
          </div>
        </div>
      </section>

      <!-- Testing Pipes -->
      <section class="docs-section">
        <h2>Testing Pipes</h2>
        <div class="code-block">
          <pre><code>import &#123; CapitalizePipe &#125; from './capitalize.pipe';

describe('CapitalizePipe', () =&gt; &#123;
  let pipe: CapitalizePipe;

  beforeEach(() => &#123;
    pipe = new CapitalizePipe();
  &#125;);

  it('should create an instance', () => &#123;
    expect(pipe).toBeTruthy();
  &#125;);

  it('should capitalize first letter', () => &#123;
    expect(pipe.transform('hello')).toBe('Hello');
  &#125;);

  it('should handle empty string', () => &#123;
    expect(pipe.transform('')).toBe('');
  &#125;);

  it('should handle null/undefined', () => &#123;
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
  &#125;);
&#125;);</code></pre>
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
        margin-bottom: 40px;
        padding: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
      }

      .docs-header h1 {
        margin: 0 0 10px 0;
        font-size: 2.5rem;
        font-weight: 300;
      }

      .docs-section {
        margin-bottom: 40px;
        background: white;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid #e9ecef;
      }

      .docs-section h2 {
        color: #2c3e50;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 3px solid #667eea;
      }

      .content-card {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #667eea;
      }

      .key-features h3 {
        color: #495057;
        margin: 20px 0 10px 0;
      }

      .key-features ul {
        color: #6c757d;
        padding-left: 20px;
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
      }

      .comparison-card {
        border-radius: 8px;
        padding: 20px;
        border: 1px solid #e9ecef;
      }

      .comparison-card.pure {
        background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
        border-left: 5px solid #28a745;
      }

      .comparison-card.impure {
        background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
        border-left: 5px solid #ffc107;
      }

      .comparison-card h3 {
        margin-top: 0;
        color: #2c3e50;
      }

      .features,
      .use-cases {
        margin-top: 15px;
      }

      .features h4,
      .use-cases h4 {
        color: #495057;
        margin-bottom: 8px;
      }

      .features ul,
      .use-cases ul {
        margin: 0;
        padding-left: 20px;
        color: #6c757d;
      }

      .code-block {
        background: #2d3748;
        color: #e2e8f0;
        border-radius: 6px;
        padding: 15px;
        overflow-x: auto;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 0.9rem;
        margin: 15px 0;
      }

      .code-block pre {
        margin: 0;
        white-space: pre-wrap;
      }

      .example-card,
      .technique-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }

      .example-card h3,
      .technique-card h3 {
        color: #495057;
        margin-top: 0;
        margin-bottom: 15px;
      }

      .explanation {
        background: white;
        padding: 15px;
        border-radius: 6px;
        border-left: 3px solid #17a2b8;
        margin-top: 15px;
      }

      .explanation p {
        margin-bottom: 10px;
        font-weight: 600;
        color: #495057;
      }

      .explanation ul {
        margin: 0;
        color: #6c757d;
      }

      .performance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 20px;
      }

      .performance-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
      }

      .performance-card h3 {
        color: #2c3e50;
        margin-top: 0;
      }

      .performance-card ul {
        color: #6c757d;
        padding-left: 20px;
      }

      .performance-tip {
        background: #d1ecf1;
        border: 1px solid #bee5eb;
        border-radius: 4px;
        padding: 10px;
        margin-top: 15px;
        color: #0c5460;
      }

      .performance-warning {
        background: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        padding: 10px;
        margin-top: 15px;
        color: #721c24;
      }

      .best-practices {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }

      .practice-item {
        background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
        border: 1px solid #90caf9;
        border-radius: 8px;
        padding: 20px;
        border-left: 5px solid #2196f3;
      }

      .practice-item h4 {
        color: #1565c0;
        margin-top: 0;
        margin-bottom: 10px;
      }

      .practice-item p {
        color: #1565c0;
        margin: 0;
      }

      @media (max-width: 768px) {
        .comparison-grid,
        .performance-grid {
          grid-template-columns: 1fr;
        }

        .docs-header h1 {
          font-size: 2rem;
        }

        .docs-section {
          padding: 20px;
        }
      }
    `,
  ],
})
export class PipesDocsComponent {}
