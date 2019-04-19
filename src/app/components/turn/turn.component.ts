import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { mergeMap, pluck } from 'rxjs/operators';
import { advanceTurn, deleteTurn } from 'src/app/actions';
import { State } from 'src/app/reducers';
import { selectTurnById } from 'src/app/selectors';
import { Turn } from 'src/app/turn.model';

@Component({
  selector: 'wt-turn',
  templateUrl: './turn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TurnComponent implements OnInit, OnDestroy {
  turn!: Turn;

  constructor(private route: ActivatedRoute, private store: Store<State>, private router: Router) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        pluck('id'),
        mergeMap(turnId => {
          return this.store.pipe(select(selectTurnById, { id: turnId }));
        }),
        untilDestroyed(this),
      )
      .subscribe(turn => (this.turn = turn));
  }

  ngOnDestroy(): void {}

  get currentCandidate(): string {
    return this.turn.candidates[this.turn.currentIndex];
  }

  moveToNext(): void {
    this.store.dispatch(advanceTurn({ turn: this.turn }));
  }

  deleteTurn(): void {
    this.store.dispatch(deleteTurn({turn: this.turn}));
    this.router.navigate(['/']);
  }
}
