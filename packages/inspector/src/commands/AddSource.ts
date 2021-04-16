import { MenuCommandFactory, IMenuCommand, IDialogUser, IContext } from '../interfaces';
import { ISceneNode, sphereSourceType } from '@mp/common';
import { boxSourceType } from '@mp/common/src/sdk-components/BoxSource';
import { cylinderSourceType } from '@mp/common/src/sdk-components/CylinderSource';

class AddSource implements IMenuCommand<void> {
  static sourceCount = 1;

  constructor(private context: IContext, private componentType: string, private name: string) {}

  dialogUser(): IDialogUser {
    return null;
  }

  async execute(): Promise<void> {
    const node = await this.context.sdk.sdk.Scene.createNode() as ISceneNode;
    node.name = `${this.name}-Source-${AddSource.sourceCount++}`;
    node.addComponent(this.componentType, {
      sensor: this.context.scene.sensor,
    });
    node.start();

    this.context.scene.addObject(node);
  }
}

export const makeSphereSourceFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new AddSource(context, sphereSourceType, 'Sphere');
  }
};

export const makeBoxSourceFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new AddSource(context, boxSourceType, 'Box');
  }
};

export const makeCylinderSourceFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new AddSource(context, cylinderSourceType, 'Cylinder');
  }
};
