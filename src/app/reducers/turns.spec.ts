import {
  deleteTurn,
  deleteTurnSuccess,
  loadTurns,
  loadTurnsSuccess,
  saveTurn,
  saveTurnSuccess,
} from 'src/app/actions';
import { initialState, turnsReducer } from 'src/app/reducers/turns';
import { STUB_TURN_A, STUB_TURN_B } from 'src/app/testing/fixtures';
import { Turn } from 'src/app/turn.model';

describe('Turns reducer', () => {
  it('should return the initial state', () => {
    const state = turnsReducer(undefined, { type: 'INIT' });
    expect(state).toEqual(initialState);
  });

  it('should handle the loadTurns action', () => {
    const state = turnsReducer(undefined, loadTurns());
    expect(state).toEqual({ ...initialState, isLoading: true });
  });

  it('should handle the loadTurnsSuccess action', () => {
    const state = turnsReducer(
      { ...initialState, isLoading: true },
      loadTurnsSuccess({ turns: [STUB_TURN_A, STUB_TURN_B] }),
    );
    expect(state).toEqual({
      ...initialState,
      turns: { [STUB_TURN_A.id]: STUB_TURN_A, [STUB_TURN_B.id]: STUB_TURN_B },
    });
  });

  it('should handle the saveTurn action', () => {
    const turnToSave: Turn = { ...STUB_TURN_A, label: 'New' };
    const preSaveState = {
      ...initialState,
      turns: { [STUB_TURN_A.id]: STUB_TURN_A, [STUB_TURN_B.id]: STUB_TURN_B },
    };
    const state = turnsReducer(preSaveState, saveTurn({ turn: turnToSave }));
    expect(state).toEqual({ ...preSaveState, isSaving: true });
  });

  it('should handle the saveTurnSuccess action', () => {
    const turnToSave: Turn = { ...STUB_TURN_A, label: 'New' };
    const preSaveState = {
      ...initialState,
      turns: { [STUB_TURN_A.id]: STUB_TURN_A, [STUB_TURN_B.id]: STUB_TURN_B },
      isSaving: true,
    };
    const state = turnsReducer(preSaveState, saveTurnSuccess({ turn: turnToSave }));
    const updatedTurns = { [STUB_TURN_A.id]: turnToSave, [STUB_TURN_B.id]: STUB_TURN_B };
    expect(state).toEqual({ ...preSaveState, isSaving: false, turns: updatedTurns });
  });

  it('should handle the deleteTurn action', () => {
    const preDeleteState = {
      ...initialState,
      turns: { [STUB_TURN_A.id]: STUB_TURN_A, [STUB_TURN_B.id]: STUB_TURN_B },
    };
    const state = turnsReducer(preDeleteState, deleteTurn({ turn: STUB_TURN_A }));
    expect(state).toEqual({ ...preDeleteState, isDeleting: true });
  });

  it('should handle the deleteTurnSuccess action', () => {
    const preDeleteState = {
      ...initialState,
      turns: { [STUB_TURN_A.id]: STUB_TURN_A, [STUB_TURN_B.id]: STUB_TURN_B },
      isDeleting: true,
    };
    const state = turnsReducer(preDeleteState, deleteTurnSuccess({ turn: STUB_TURN_A }));
    const updatedTurns = { [STUB_TURN_B.id]: STUB_TURN_B };
    expect(state).toEqual({ ...preDeleteState, isDeleting: false, turns: updatedTurns });
  });
});
