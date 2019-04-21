import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import { deleteTurn, saveTurn } from 'src/app/actions';
import { State } from 'src/app/reducers';
import { selectTurnById } from 'src/app/selectors';
import { Turn } from 'src/app/turn.model';

@Component({
  selector: 'wt-turn',
  templateUrl: './turn.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .mat-display-1 {
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class TurnComponent implements OnInit, OnDestroy {
  turn!: Turn;

  readonly isLargeScreen$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
    private router: Router,
    breakpointObserver: BreakpointObserver,
  ) {
    this.isLargeScreen$ = breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(map(r => !r.matches));
  }

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
    const nextIndex = (this.turn.currentIndex + 1) % this.turn.candidates.length;
    this.store.dispatch(saveTurn({ turn: { ...this.turn, currentIndex: nextIndex } }));
  }

  deleteTurn(): void {
    this.store.dispatch(deleteTurn({ turn: this.turn }));
    this.router.navigate(['/']);
  }
}
