import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropsComponent } from './props/props.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    PropsComponent,
  ],
})
export class AppComponent {
  title = 'lrms';
  childMessage = 'Hello from Parent Component';

  // append numbers to title using setInterval
  // This method appends numbers 1 to 10 to the title
  // It can be called to demonstrate dynamic updates
  // For example, you can call this method in ngOnInit or on a button click
  ngOnInit() {
    // Uncomment the line below to append numbers when the component initializes
    this.appendNumbers();
  }

  appendNumbers() {
    let count = 1;
    const interval = setInterval(() => {
      if (count <= 10) {
        this.title += ` ${count}`;
        count++;
      } else {
        clearInterval(interval);
      }
    }, 1000); // Update every second
  }

  consumeEvent(event: string) {
    console.log('Event from child component:', event);
    this.childMessage = event;
  }
}
