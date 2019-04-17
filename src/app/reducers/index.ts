import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { turnsReducer, TurnsState } from 'src/app/reducers/turns';
import { environment } from '../../environments/environment';

export interface State {
  turns: TurnsState;
}


export const reducers: ActionReducerMap<State> = {
  turns: turnsReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
