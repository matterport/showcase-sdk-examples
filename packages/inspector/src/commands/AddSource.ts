import { MenuCommandFactory, IMenuCommand, IDialogUser, IAppContext } from '../interfaces';
import { sphereSourceType, boxSourceType, cylinderSourceType } from '@mp/common';
import type { MpSdk } from '../../../bundle/sdk';

class AddSource implements IMenuCommand<void> {
  static sourceCount = 1;

  constructor(private appContext: IAppContext, private componentType: string, private name: string) {}

  dialogUser(): IDialogUser {
    return null;
  }

  async execute(): Promise<void> {
    const node = this.appContext.scene.sceneObject.addNode();
    node.name = `${this.name}-Source-${AddSource.sourceCount++}`;
    node.position.copy(await this.appContext.scene.getSpawnPosition());
    node.addComponent(this.componentType, {
      sensor: this.appContext.scene.sensor,
    });
    node.start();

    this.appContext.scene.addObject(node);
  }
}

export const makeSphereSourceFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddSource(appContext, sphereSourceType, 'Sphere');
  }
};

export const makeBoxSourceFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddSource(appContext, boxSourceType, 'Box');
  }
};

export const makeCylinderSourceFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddSource(appContext, cylinderSourceType, 'Cylinder');
  }
};
