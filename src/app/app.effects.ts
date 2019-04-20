import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { INIT } from '@ngrx/store';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import {
  deleteTurn,
  deleteTurnSuccess,
  loadTurns,
  loadTurnsSuccess,
  saveTurn,
  saveTurnSuccess,
  TurnAction,
} from 'src/app/actions';
import { StorageService } from 'src/app/storage.service';
import { Turns } from 'src/app/turn.model';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private storage: StorageService) {}

  @Effect()
  loadTurns$ = this.actions$.pipe(
    ofType(loadTurns.type, INIT),
    mergeMap(() => this.storage.loadTurns()),
    map((turns: Turns) => loadTurnsSuccess({ turns })),
  );

  @Effect()
  saveTurns$ = this.actions$.pipe(
    ofType(saveTurn.type),
    mergeMap(action => {
      const turn = (action as TurnAction).turn;
      return this.storage.upsertTurn(turn).pipe(mapTo(saveTurnSuccess({ turn })));
    }),
  );

  @Effect()
  deleteTurn$ = this.actions$.pipe(
    ofType(deleteTurn.type),
    mergeMap(action => {
      const turn = (action as TurnAction).turn;
      return this.storage.deleteTurn(turn).pipe(mapTo(deleteTurnSuccess({ turn })));
    }),
  );
}
