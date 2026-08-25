import { Events } from 'phaser';
import { IGameState } from './interfaces';

class GameState implements IGameState {
  public readonly events = new Events.EventEmitter();

  private _total = 0;
  private _captured = 0;
  private _debug = false;

  get total() { return this._total; }
  set total(value: number) {
    if (this._total === value) return;
    this._total = value;
    this.events.emit('total', value);
  }

  get captured() { return this._captured; }
  set captured(value: number) {
    if (this._captured === value) return;
    this._captured = value;
    this.events.emit('captured', value);
  }

  get debug() { return this._debug; }
  set debug(value: boolean) {
    if (this._debug === value) return;
    this._debug = value;
    this.events.emit('debug', value);
  }
}

export const MakeGameState = function (): IGameState {
  const state = new GameState();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('debug')) {
    state.debug = urlParams.get('debug') === '1';
  }
  return state;
};
