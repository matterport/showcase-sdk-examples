import { Events, Game } from 'phaser';

/**
 * Dependencies passed around to scenes and react components.
 */
export interface ISceneConfig {
  game: Game;
  eventBus: Events.EventEmitter;
  gameState: IGameState;
  sdk: any;
}

export interface IGameState {
  total: number;
  captured: number;
  debug: boolean;
  readonly events: Events.EventEmitter;
}
