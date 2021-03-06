import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDrawer, MatSnackBar, MatSnackBarDismiss, MatSnackBarRef } from '@angular/material';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { from, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
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
export class AppComponent implements OnInit, OnDestroy {
  readonly turns$ = this.store.pipe(select(selectTurnsOrdered));

  readonly isLargeScreen$: Observable<boolean>;

  constructor(
    private router: Router,
    breakpointObserver: BreakpointObserver,
    private store: Store<State>,
    @Inject(Icons) private readonly icons: ReadonlyArray<string>,
    private updates: SwUpdate,
    private snackBar: MatSnackBar,
  ) {
    this.isLargeScreen$ = breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(map(r => !r.matches));
  }

  ngOnInit(): void {
    this.store.dispatch(loadTurns());
    this.updates.available
      .pipe(
        mergeMap(() => from(this.updates.activateUpdate())),
        mergeMap(() => {
          return this.snackBar
            .open('A new version is available', 'Reload', {
              duration: 10000,
            })
            .afterDismissed();
        }),
        untilDestroyed(this),
      )
      .subscribe((snackBarRef: MatSnackBarDismiss) => {
        if (snackBarRef.dismissedByAction) {
          location.reload();
        }
      });
  }

  ngOnDestroy(): void {}

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

  closeOverMenu(drawer: MatDrawer): void {
    if (drawer.mode === 'over') {
      drawer.close();
    }
  }
}
