import { Routes } from '@angular/router';
import { HomeComponent } from 'src/app/components/home/home.component';
import { TurnEditComponent } from 'src/app/components/turn-edit/turn-edit.component';
import { TurnGuard } from 'src/app/components/turn-guard.service';
import { TurnComponent } from 'src/app/components/turn/turn.component';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'turns/:id',
    canActivateChild: [TurnGuard],
    children: [
      { path: '', component: TurnComponent },
      { path: 'edit', component: TurnEditComponent },
    ],
  },
];
