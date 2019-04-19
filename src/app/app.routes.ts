import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/components/home/home.component';
import { TurnEditComponent } from 'src/app/components/turn-edit/turn-edit.component';
import { TurnResolve } from 'src/app/components/turn.resolve';
import { TurnComponent } from 'src/app/components/turn/turn.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'turns/:id',
    resolve: {
      turn: TurnResolve,
    },
    children: [
      { path: '', component: TurnComponent },
      { path: 'edit', component: TurnEditComponent },
    ],
  },
];
