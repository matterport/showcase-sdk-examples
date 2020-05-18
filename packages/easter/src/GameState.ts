import { IGameState } from './interfaces';
import { ObservableValue } from '@mp/core';

class GameState implements IGameState {
  public total: ObservableValue<number> = new ObservableValue(0);
  public captured: ObservableValue<number> = new ObservableValue(0);
  public debug: ObservableValue<boolean> = new ObservableValue(false);
}

export const MakeGameState = function(): IGameState {
  const state = new GameState();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('debug')) {
    state.debug.value = urlParams.get('debug') === '1';
  }
  return state;
};