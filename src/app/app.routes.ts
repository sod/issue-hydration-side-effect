import { Routes } from '@angular/router';
import { Frozen } from './frozen';
import { Mutable } from './mutable';

export const routes: Routes = [
  { path: 'frozen', component: Frozen },
  { path: 'mutable', component: Mutable },
  { path: '', pathMatch: 'full', redirectTo: 'frozen' },
];
