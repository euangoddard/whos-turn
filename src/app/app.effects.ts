import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, INIT } from '@ngrx/store';
import { map, mapTo, mergeMap } from 'rxjs/operators';
import {
  advanceTurn,
  advanceTurnSuccess,
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
    ofType(saveTurn.type, advanceTurn.type),
    mergeMap(action => {
      const turn = (action as TurnAction).turn;
      const nextAction = action.type === saveTurn.type ? saveTurnSuccess : advanceTurnSuccess;
      return this.storage.upsertTurn(turn).pipe(mapTo(nextAction({ turn })));
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
