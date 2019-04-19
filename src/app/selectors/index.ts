import { createSelector } from '@ngrx/store';
import { sortBy } from 'lodash-es';
import { State } from 'src/app/reducers';
import { TurnsState } from 'src/app/reducers/turns';

export const selectTurnsState = (state: State) => state.turns;

export const selectTurnsOrdered = createSelector(
  selectTurnsState,
  (state: TurnsState) => sortBy(Object.values(state.turns), 'label'),
);

export const selectTurnById = createSelector(
  (state: State, props: { id: string }) => state.turns.turns[props.id],
);
