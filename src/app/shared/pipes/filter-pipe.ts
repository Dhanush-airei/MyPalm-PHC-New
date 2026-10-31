import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }

    if (!searchText || !searchText.trim()) {
      return items;
    }

    const searchValue = searchText.toLowerCase().trim();

    return items.filter((item: any) => {
      return Object.values(item).some((value: any) => {
        if (value === null || value === undefined) {
          return false;
        }

        return String(value).toLowerCase().includes(searchValue);
      });
    });
  }
}
