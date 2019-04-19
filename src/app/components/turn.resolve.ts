import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { take } from 'rxjs/operators';
import { State } from 'src/app/reducers';
import { selectTurnById } from 'src/app/selectors';
import { Turn } from 'src/app/turn.model';

@Injectable({
  providedIn: 'root',
})
export class TurnResolve implements Resolve<Turn> {
  constructor(private store: Store<State>, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Turn> {
    const turnId = route.params.id;
    return this.store.pipe(
      select(selectTurnById, { id: turnId }),
      take(1),
      tap(turn => {
        if (!turn) {
          this.router.navigate(['/']);
        }
      }),
    );
  }
}
