import { MenuCommandFactory, IMenuCommand, IDialogUser, IContext } from '../interfaces';
import { ISceneNode } from '@mp/common';

class AddSimple implements IMenuCommand<void> {
  constructor(private context: IContext, private name: string, private componentType: string) {}

  dialogUser(): IDialogUser {
    return null;
  }

  async execute(): Promise<void> {
    const node = await this.context.sdk.sdk.Scene.createNode();
    node.name = this.name
    node.addComponent(this.componentType);
    node.start();
    this.context.scene.addObject(node);
  }
}

export const makeAddAmbientLightFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new AddSimple(context, 'Ambient Light', 'mp.ambientLight');
  };
};

export const makeAddDirectionalLightFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new AddSimple(context, 'Directional Light', 'mp.directionalLight');
  };
};

export const makeAddPointLightFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new AddSimple(context, 'Point Light', 'mp.pointLight');
  };
};
