import { Component } from '@angular/core';

// Simulates state from a store with immutability checks (e.g. NgRx strictStateImmutability)
const items = Object.freeze(Array.from({ length: 7 }, (_, id) => Object.freeze({ id })));

@Component({
  selector: 'app-frozen',
  template: `
    @let list = items;
    <ul>
      @for (item of list; track item.id) {
        <li>{{ item.id }} of {{ list.length }}</li>
      }
    </ul>
  `,
})
export class Frozen {
  protected readonly items = items;
}
