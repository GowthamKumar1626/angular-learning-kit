import { Pipe, PipeTransform } from '@angular/core';

/**
 * PURE PIPES - Default behavior in Angular
 * Pure pipes are only re-evaluated when Angular detects a pure change to the input value.
 * They are stateless and don't depend on external state.
 */

@Pipe({
  name: 'capitalize',
  pure: true, // This is the default, so we can omit this line
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    console.log('CapitalizePipe transform called with:', value);

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}

@Pipe({
  name: 'truncate',
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, suffix: string = '...'): string {
    if (!value) return '';

    console.log('TruncatePipe transform called with:', value, 'limit:', limit);

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + suffix;
  }
}

@Pipe({
  name: 'multiply',
  pure: true,
})
export class MultiplyPipe implements PipeTransform {
  transform(value: number, multiplier: number = 1): number {
    console.log(
      'MultiplyPipe transform called with:',
      value,
      'multiplier:',
      multiplier
    );

    return value * multiplier;
  }
}

@Pipe({
  name: 'currency',
  pure: true,
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(
    value: number,
    currencySymbol: string = '$',
    digits: number = 2
  ): string {
    if (value === null || value === undefined) return '';

    console.log('CustomCurrencyPipe transform called with:', value);

    return `${currencySymbol}${value.toFixed(digits)}`;
  }
}

@Pipe({
  name: 'filter',
  pure: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, property?: string): any[] {
    if (!items || !searchText) {
      return items || [];
    }

    console.log(
      'FilterPipe transform called with:',
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
  name: 'sort',
  pure: true,
})
export class SortPipe implements PipeTransform {
  transform(items: any[], property?: string, reverse: boolean = false): any[] {
    if (!items || items.length <= 1) {
      return items || [];
    }

    console.log('SortPipe transform called with:', items.length, 'items');

    const sorted = [...items].sort((a, b) => {
      const aValue = property ? a[property] : a;
      const bValue = property ? b[property] : b;

      if (aValue < bValue) return reverse ? 1 : -1;
      if (aValue > bValue) return reverse ? -1 : 1;
      return 0;
    });

    return sorted;
  }
}
