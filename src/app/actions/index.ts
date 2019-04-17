import { createAction, props, union } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Turn, Turns } from 'src/app/turn/turn.model';

const TURN_NAMESPACE = '[Turns] ';

export const loadTurns = createAction(TURN_NAMESPACE + 'Load turn');
export const loadTurnsSuccess = createAction(
  TURN_NAMESPACE + 'Load turn success',
  props<{ turns: Turns }>(),
);

export const saveTurn = createAction(TURN_NAMESPACE + 'Save turn', props<{ turn: Turn }>());
export const saveTurnSuccess = createAction(
  TURN_NAMESPACE + 'Save turn success',
  props<{ turn: Turn }>(),
);

export const advanceTurn = createAction(TURN_NAMESPACE + 'Advance turn', props<{ turn: Turn }>());
export const advanceTurnSuccess = createAction(
  TURN_NAMESPACE + 'Advance turn success',
  props<{ turn: Turn }>(),
);

export const deleteTurn = createAction(TURN_NAMESPACE + 'Delete turn', props<{ turn: Turn }>());
export const deleteTurnSuccess = createAction(
  TURN_NAMESPACE + 'Delete turn success',
  props<{ turn: Turn }>(),
);


export type TurnAction = TypedAction<string> & {turn: Turn};
export type TurnsAction = TypedAction<string> & {turns: Turns};
