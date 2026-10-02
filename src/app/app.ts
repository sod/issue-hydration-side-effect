import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  template: `
    <nav>
      <a href="/frozen">/frozen</a> |
      <a href="/mutable">/mutable</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
