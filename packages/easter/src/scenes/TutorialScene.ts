import 'phaser';
import { SceneIds } from './SceneIds';
import { ISceneConfig } from '../interfaces';

export class TutorialScene extends Phaser.Scene {

  constructor() {
    super({ key: SceneIds.Tutorial });
  }

  init(config: ISceneConfig): void {}
};
