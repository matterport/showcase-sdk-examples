import { Events, Game } from 'phaser';
import { ObservableValue } from '@mp/core';

/**
 * Dependencies passed around to scenes and react components.
 */
export interface ISceneConfig {
  game: Game;
  eventBus: Events.EventEmitter;
  gameState: IGameState;
  sdk: any;
}


export const GameStateOnChanged = 'onchanged';

export interface IGameState {
  readonly total: ObservableValue<number>;
  readonly captured: ObservableValue<number>;
  readonly debug: ObservableValue<boolean>;
}
