import { Pipe, PipeTransform } from '@angular/core';

/**
 * IMPURE PIPES - Set pure: false
 * Impure pipes are re-evaluated on every change detection cycle.
 * They can depend on external state and may return different results for the same input.
 */

@Pipe({
  name: 'impureFilter',
  pure: false, // This makes the pipe impure
})
export class ImpureFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, property?: string): any[] {
    if (!items || !searchText) {
      return items || [];
    }

    console.log(
      'ImpureFilterPipe transform called with:',
      items.length,
      'items, search:',
      searchText
    );

    return items.filter((item) => {
      const value = property ? item[property] : item;
      return value.toString().toLowerCase().includes(searchText.toLowerCase());
    });
  }
}

@Pipe({
  name: 'timeAgo',
  pure: false, // Time-dependent pipes should be impure
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    console.log('TimeAgoPipe transform called at:', now.toLocaleTimeString());

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}

@Pipe({
  name: 'randomColor',
  pure: false, // Returns different results for same input
})
export class RandomColorPipe implements PipeTransform {
  private colors = [
    'red',
    'blue',
    'green',
    'orange',
    'purple',
    'pink',
    'teal',
    'indigo',
  ];

  transform(value: any): string {
    console.log('RandomColorPipe transform called for:', value);

    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}

@Pipe({
  name: 'liveSearch',
  pure: false, // Depends on external state changes
})
export class LiveSearchPipe implements PipeTransform {
  private lastSearchTime = 0;

  transform(items: any[], searchText: string, property?: string): any[] {
    this.lastSearchTime = Date.now();

    if (!items || !searchText) {
      return items || [];
    }

    console.log(
      'LiveSearchPipe transform called at:',
      new Date().toLocaleTimeString()
    );

    return items.filter((item) => {
      const value = property ? item[property] : item;
      return value.toString().toLowerCase().includes(searchText.toLowerCase());
    });
  }
}

@Pipe({
  name: 'counter',
  pure: false, // Maintains internal state
})
export class CounterPipe implements PipeTransform {
  private callCount = 0;

  transform(value: any): string {
    this.callCount++;
    console.log('CounterPipe called', this.callCount, 'times');

    return `${value} (called ${this.callCount} times)`;
  }
}

@Pipe({
  name: 'asyncData',
  pure: false, // May depend on async operations
})
export class AsyncDataPipe implements PipeTransform {
  private cache = new Map<string, any>();

  transform(key: string, defaultValue: string = 'Loading...'): string {
    console.log('AsyncDataPipe transform called for key:', key);

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Simulate async data loading
    setTimeout(() => {
      this.cache.set(
        key,
        `Data for ${key} loaded at ${new Date().toLocaleTimeString()}`
      );
    }, 1000);

    return defaultValue;
  }
}
