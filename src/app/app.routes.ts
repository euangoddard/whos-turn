import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/home/home.component';
import { TurnEditComponent } from 'src/app/turn-edit/turn-edit.component';
import { TurnComponent } from 'src/app/turn/turn.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'turns/:id',
    children: [
      { path: '', component: TurnComponent },
      { path: 'edit', component: TurnEditComponent },
    ],
  },
];
