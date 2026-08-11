import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateHelper {
  public toDateOnly(value: any): string | null {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Example usage within the class
  public formatDate(value: any): string {
    return this.toDateOnly(value) || 'Invalid Date';
  }

  public processData(data: any[]): any[] {
    return data.map(item => ({
      ...item,
      formattedDate: this.toDateOnly(item.date)
    }));
  }
}

