import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-mutable',
  template: `
    @let list = items;
    <ul>
      @for (item of list; track item.id) {
        <li>{{ item.id }} of {{ list.length }}</li>
      }
    </ul>
    <button (click)="inspect()">Inspect items[6]</button>
    <pre>{{ keys() }}</pre>
  `,
})
export class Mutable {
  protected readonly items = Array.from({ length: 7 }, (_, id) => ({ id }));
  protected readonly keys = signal('');

  protected inspect(): void {
    this.keys.set(JSON.stringify(Object.keys(this.items[6])));
  }
}
