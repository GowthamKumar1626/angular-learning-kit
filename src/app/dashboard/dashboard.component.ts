import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  signal,
  ChangeDetectorRef,
} from '@angular/core';
import {
  firstValueFrom,
  Subscription,
  Observable,
  BehaviorSubject,
} from 'rxjs';

interface DashboardData {
  // Define the structure of the data you expect to fetch for the dashboard
  // For example, if you're fetching a list of items, you might have:
  id?: number;
  userId?: number;
  title?: string;
  completed?: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    // Import any components, directives, or pipes that this component uses
    // For example, if you have a shared module or other components to include
    // You can import them here
    // Example: SharedModule, SomeOtherComponent
    // SharedModule,
    // SomeOtherComponent,
    CommonModule,
    JsonPipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
}) // Why do we use the imports array here?
// // The imports array is used to declare any components, directives, or pipes that this component uses.
// Why DashboardComponent implements OnInit?
// // The OnInit interface is a lifecycle hook that allows you to perform initialization logic after the component's constructor has been called.
// // This is where you typically fetch data or set up the component's state.
// // It is a good practice to use ngOnInit for data loading instead of the constructor, as the component is fully initialized at that point.
// // The ngOnInit method is called once the component is initialized, making it a suitable place for any setup that requires the component to be fully constructed.
// // Can't we use ngOnInit without implementing OnInit?
// // Yes, you can use ngOnInit without explicitly implementing the OnInit interface, but
// // implementing OnInit provides better type checking and clarity in your code.
// // What I need to do if I want to use ngOnChanges?
// // If you want to use ngOnChanges, you need to implement the OnChanges interface
// // and define the ngOnChanges method in your component. This method is called whenever any
// // data-bound input properties change. It allows you to respond to changes in input properties.
// // You can also use ngOnChanges without implementing OnChanges, but it is not recommended
export class DashboardComponent implements OnInit, OnDestroy {
  private streamData!: Subscription;
  private eventSource?: EventSource;
  title = 'Dashboard';
  description = 'This is the dashboard component of the application.';
  dashboardData: DashboardData = {}; // This will hold the data fetched for the dashboard
  updates: string[] = []; // This will hold the updates for the dashboard
  firstUpdate: string | null = null; // This will hold the first update received from the stream

  // Using signals for reactive updates (Angular 16+)
  // Signals automatically trigger change detection when updated
  updatesSignal = signal<string[]>([]);
  firstUpdateSignal = signal<string | null>(null);

  // Using BehaviorSubject for async pipe (reactive approach)
  updatesSubject = new BehaviorSubject<string[]>([]);
  updates$ = this.updatesSubject.asObservable(); // Observable for async pipe

  // CDR approach - regular property updated manually
  updatesCDR: string[] = [];

  constructor(
    // You can inject services here if needed
    // For example, if you need to fetch data from an API, you might inject HttpClient
    private http: HttpClient,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    // Initialization logic can go here
    console.log('DashboardComponent initialized');

    // You can also fetch data or perform other setup tasks here
    // Is it good practice to load data in the constructor?
    // Generally, it's better to use ngOnInit for data loading
    // but for simple initialization, the constructor can be used.
  }

  async ngOnInit() {
    // This lifecycle hook is called after the component is initialized
    console.log('DashboardComponent ngOnInit called');
    // You can perform additional initialization here if needed
    // For example, you might want to load data here instead of in the constructor
    await this.loadData(); // Call the method to load data for the dashboard
  }

  ngOnChanges() {
    // This lifecycle hook is called when any data-bound input properties change
    console.log('DashboardComponent ngOnChanges called');
    // You can respond to changes in input properties here
  }

  // loadData() {
  //   // Simulate data loading
  //   console.log('Loading data for the dashboard...');
  //   // Here you would typically make an HTTP request to fetch data
  //   // For example:
  //   this.http
  //     .get('https://jsonplaceholder.typicode.com/todos/1')
  //     .subscribe((data) => {
  //       console.log('Data loaded:', data);
  //       this.dashboardData = data; // Assign the fetched data to the dashboardData property
  //     });

  //   // Note: In a real application, you would handle errors and loading states appropriately
  //   // For example, you might show a loading spinner while the data is being fetched
  //   // and handle errors gracefully if the request fails.
  //   // You can also use async/await syntax if you prefer that style for handling asynchronous operations
  //   // Example:
  //   // async loadData() {
  //   //   try {
  //   //     const data = await this.http.get<DashboardData>('https://jsonplaceholder.typicode.com/todos/1').toPromise();
  //   //     this.dashboardData = data;
  //   //   } catch (error) {
  //   //     console.error('Error loading data:', error);
  //   //   }
  //   // }
  // }

  ngOnDestroy() {
    // This lifecycle hook is called when the component is about to be destroyed
    console.log('DashboardComponent ngOnDestroy called');
    this.streamData?.unsubscribe(); // Unsubscribe from the streamData observable to prevent memory leaks
    this.eventSource?.close(); // Close the EventSource connection

    // Complete the BehaviorSubject to prevent memory leaks
    this.updatesSubject.complete();
  }

  // Create an Observable from Server-Sent Events
  private createSSEObservable(url: string): Observable<string> {
    return new Observable((observer) => {
      this.eventSource = new EventSource(url);

      this.eventSource.onmessage = (event) => {
        // Run inside Angular's zone to trigger change detection
        this.ngZone.run(() => {
          observer.next(event.data);
        });
      };

      this.eventSource.onerror = (error) => {
        this.ngZone.run(() => {
          observer.error(error);
        });
      };

      // Cleanup function
      return () => {
        this.eventSource?.close();
      };
    });
  }

  // Alternative: SSE Observable WITHOUT NgZone - using signals instead
  private createSSEObservableWithSignals(url: string): Observable<string> {
    return new Observable((observer) => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        // No NgZone needed - signals automatically trigger change detection
        observer.next(event.data);
      };

      eventSource.onerror = (error) => {
        observer.error(error);
      };

      // Cleanup function
      return () => {
        eventSource?.close();
      };
    });
  }

  // Alternative: Manual change detection with ChangeDetectorRef
  // You would inject ChangeDetectorRef and call detectChanges() manually
  private createSSEObservableWithCDR(url: string): Observable<string> {
    return new Observable((observer) => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        observer.next(event.data);
        // Manual change detection - triggers UI update
        this.cdr.detectChanges();
      };

      eventSource.onerror = (error) => {
        observer.error(error);
      };

      // Cleanup function
      return () => {
        eventSource?.close();
      };
    });
  }

  // For Async Pipe: Observable that emits the raw data
  private createSSEObservableForAsyncPipe(url: string): Observable<string> {
    return new Observable((observer) => {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        // No manual change detection needed - async pipe handles it
        observer.next(event.data);
      };

      eventSource.onerror = (error) => {
        observer.error(error);
      };

      // Cleanup function
      return () => {
        eventSource?.close();
      };
    });
  }

  async loadData() {
    try {
      // const data = await firstValueFrom(
      //   this.http.get<DashboardData>(
      //     'https://jsonplaceholder.typicode.com/todos/1'
      //   )
      // );

      // Fetch data from an API endpoint using observable
      const response = this.http.get<DashboardData>(
        'https://jsonplaceholder.typicode.com/todos/1'
      );
      // Subscribe to the observable to get the data
      response.subscribe((data) => {
        console.log('Data loaded:', data);
        this.dashboardData = data; // Assign the fetched data to the dashboardData property
      });

      // Approach 1: Using NgZone (original approach)
      this.streamData = this.createSSEObservable(
        'http://localhost:3000/stream'
      ).subscribe({
        next: (data) => {
          // Handle the data emitted by the observable
          // In this case, we are pushing the data to the updates array
          this.updates.push(data);
          console.log('Update received:', data);
        },
        error: (error) => console.error('Error fetching updates:', error),
        complete: () => console.log('Updates fetching completed'),
      });

      // Approach 2: Using signals (no NgZone needed)
      // Signals automatically trigger change detection when updated
      this.createSSEObservableWithSignals(
        'http://localhost:3000/stream'
      ).subscribe({
        next: (data) => {
          // Update signal - this automatically triggers change detection
          this.updatesSignal.update((current) => [...current, data]);
          console.log('Update received (signals):', data);
        },
        error: (error) =>
          console.error('Error fetching updates (signals):', error),
      });

      // Approach 3: Using ChangeDetectorRef (manual change detection)
      this.createSSEObservableWithCDR('http://localhost:3000/stream').subscribe(
        {
          next: (data) => {
            // Update array and manually trigger change detection
            this.updatesCDR.push(data);
            console.log('Update received (CDR):', data);
            // Note: detectChanges() is called inside createSSEObservableWithCDR
          },
          error: (error) =>
            console.error('Error fetching updates (CDR):', error),
        }
      );

      // Approach 4: Using BehaviorSubject for async pipe
      this.createSSEObservableForAsyncPipe(
        'http://localhost:3000/stream'
      ).subscribe({
        next: (data) => {
          // Update BehaviorSubject - async pipe handles change detection
          const currentUpdates = this.updatesSubject.value;
          this.updatesSubject.next([...currentUpdates, data]);
          console.log('Update received (Async Pipe):', data);
        },
        error: (error) =>
          console.error('Error fetching updates (Async Pipe):', error),
      });

      // Alternative approach using firstValueFrom for getting the first SSE event
      // This will only get the first update and then complete
      try {
        this.firstUpdate = await firstValueFrom(
          this.createSSEObservable('http://localhost:3000/stream')
        );
        console.log(
          'First update received using firstValueFrom:',
          this.firstUpdate
        );

        // Using signals with firstValueFrom
        const firstUpdateWithSignal = await firstValueFrom(
          this.createSSEObservableWithSignals('http://localhost:3000/stream')
        );
        this.firstUpdateSignal.set(firstUpdateWithSignal);
        console.log('First update with signal:', firstUpdateWithSignal);
      } catch (error) {
        console.error('Error getting first update:', error);
      }

      // Do I need to Unsubscribe from the observable?
      // In this case, since we are only interested in the first emitted value,
      // we do not need to unsubscribe explicitly.
      // However, if you were to subscribe to an observable that emits multiple values over time,
      // it is a good practice to unsubscribe to avoid memory leaks.
      // You can use the take(1) operator to automatically unsubscribe after the first emission,
      // or use the async pipe in the template to handle subscriptions automatically.

      // if (data) {
      //   this.dashboardData = data;
      // }
      // Why do we use firstValueFrom here?
      // firstValueFrom is used to convert an Observable to a Promise,
      // allowing us to use async/await syntax for better readability and error handling.
      // This is particularly useful when you want to wait for the first emitted value from an Observable`

      // What is the difference between using firstValueFrom and subscribe?
      // Using firstValueFrom allows you to convert an Observable to a Promise,
      // which can be used with async/await syntax for better readability and error handling.
      // On the other hand, using subscribe allows you to handle the emitted values directly
      // and is more suitable for scenarios where you want to react to multiple emissions over time.
      // In this case, since we are only interested in the first emitted value,
      // using firstValueFrom is more appropriate as it simplifies the code and avoids the need for
      // managing subscriptions manually.

      // What does subscribing mean in this context?
      // Subscribing to an Observable means that you are registering a callback function
      // that will be called whenever the Observable emits a value.
      // In this case, we are subscribing to the HTTP request Observable to receive the data
      // returned from the API endpoint. When the data is available, the callback function is executed
      // and the data is assigned to the dashboardData property.
      // This allows you to react to the data as soon as it is available.
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
}
