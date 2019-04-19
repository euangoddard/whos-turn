import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map, take } from 'rxjs/operators';
import { State } from 'src/app/reducers';
import { selectTurnById } from 'src/app/selectors';

@Injectable({
  providedIn: 'root',
})
export class TurnGuard implements CanActivateChild {
  constructor(private store: Store<State>, private router: Router) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    const turnId = childRoute.params.id;
    return this.store.pipe(
      select(selectTurnById, { id: turnId }),
      take(1),
      map(Boolean),
      tap(turn => {
        if (!turn) {
          this.router.navigate(['/']);
        }
      }),
    );
  }
}
