import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { loadTurns, saveTurn } from 'src/app/actions';
import { Icons } from 'src/app/icons';
import { State } from 'src/app/reducers';
import { selectTurnsOrdered } from 'src/app/selectors';
import { Turn } from 'src/app/turn.model';
import * as shortid from 'shortid';

@Component({
  selector: 'whos-turn',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly turns$ = this.store.pipe(select(selectTurnsOrdered));

  readonly isLargeScreen$: Observable<boolean>;

  constructor(
    private router: Router,
    breakpointObserver: BreakpointObserver,
    private store: Store<State>,
    @Inject(Icons) private readonly icons: ReadonlyArray<string>,
  ) {
    this.isLargeScreen$ = breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(map(r => !r.matches));
  }

  createNewTurn(): void {
    const turn: Turn = {
      id: shortid.generate(),
      label: 'Untitled',
      candidates: [],
      icon: this.icons[0],
      currentIndex: 0,
    };
    this.store.dispatch(saveTurn({ turn }));
    this.router.navigate(['/turns', turn.id, 'edit']);
  }

  ngOnInit(): void {
    this.store.dispatch(loadTurns());
  }
}
