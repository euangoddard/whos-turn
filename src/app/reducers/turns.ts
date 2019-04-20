import { TypedAction } from '@ngrx/store/src/models';
import {
  deleteTurn,
  deleteTurnSuccess,
  loadTurns,
  loadTurnsSuccess,
  saveTurn,
  saveTurnSuccess,
  TurnAction,
  TurnsAction,
} from 'src/app/actions';
import { ItemsById } from 'src/app/reducers/models';
import { Turn } from 'src/app/turn.model';

export interface TurnsState {
  turns: ItemsById<Turn>;
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
}

export const initialState: TurnsState = {
  turns: {},
  isLoading: false,
  isSaving: false,
  isDeleting: false,
};

export function turnsReducer(
  state: TurnsState = initialState,
  action: TypedAction<string> | TurnAction | TurnsAction,
): TurnsState {
  let nextState = state;
  switch (action.type) {
    case loadTurns.type:
      nextState = { ...state, isLoading: true };
      break;
    case loadTurnsSuccess.type:
      nextState = { ...state, isLoading: false, turns: keyById((action as TurnsAction).turns) };
      break;
    case saveTurn.type:
      nextState = { ...state, isSaving: true };
      break;
    case saveTurnSuccess.type:
      const turnSaved = (action as TurnAction).turn;
      nextState = {
        ...state,
        isSaving: false,
        turns: { ...state.turns, [turnSaved.id]: turnSaved },
      };
      break;
    case deleteTurn.type:
      nextState = { ...state, isDeleting: true };
      break;
    case deleteTurnSuccess.type:
      const turnDeleted = (action as TurnAction).turn;
      const newTurns = { ...state.turns };
      delete newTurns[turnDeleted.id];
      nextState = { ...state, isDeleting: false, turns: newTurns };
      break;
  }
  return nextState;
}

function keyById<T extends { id: string }>(items: ReadonlyArray<T>): ItemsById<T> {
  const itemsById: ItemsById<T> = {};
  items.forEach(item => {
    itemsById[item.id] = item;
  });
  return itemsById;
}
