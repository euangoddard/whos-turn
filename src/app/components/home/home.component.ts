import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { State } from 'src/app/reducers';
import { selectRecentTurns } from 'src/app/selectors';
import { Turns } from 'src/app/turn.model';

@Component({
  selector: 'wt-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  recentTurns$: Observable<Turns> = this.store.pipe(select(selectRecentTurns));

  constructor(private store: Store<State>) {}
}
