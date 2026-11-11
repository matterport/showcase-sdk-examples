import { MenuCommandFactory, IMenuCommand, IDialogUser, IAppContext } from '../interfaces';
import { cdnUrl } from '@mp/common';
import type { MpSdk } from '../../../bundle/sdk';

class AddChair implements IMenuCommand<void> {
  constructor(private appContext: IAppContext) {}

  dialogUser(): IDialogUser {
    return null;
  }

  async execute(): Promise<void> {
    const node = this.appContext.scene.sceneObject.addNode();
    node.name = 'New Model';
    node.position.copy(await this.appContext.scene.getSpawnPosition());
    node.addComponent('mp.gltfLoader', {
      url: cdnUrl + '/models/arm-chair/2/scene.gltf',
      localScale: { x: 0.001, y: 0.001, z: 0.001 },
      localPosition: { x: -0.27, y: -0.51, z: -0.35 },
      localRotation: { x: 0, y: -130, z: 0 },
    });
    node.start();
    this.appContext.scene.addObject(node);
  }
}

export const makeAddChairFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddChair(appContext);
  };
};
