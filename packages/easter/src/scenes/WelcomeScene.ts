import 'phaser';
import { SceneIds } from './SceneIds';
import { ISceneConfig } from '../interfaces';

export class WelcomeScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneIds.Welcome });
  }

  init(config: ISceneConfig): void {}
};
