import { MenuCommandFactory, IMenuCommand, IDialogUser, IAppContext } from '../interfaces';
import type { MpSdk } from '../../../bundle/sdk';

class AddSimple implements IMenuCommand<void> {
  constructor(private appContext: IAppContext, private name: string, private componentType: string) {}

  dialogUser(): IDialogUser {
    return null;
  }

  async execute(): Promise<void> {
    const node = this.appContext.scene.sceneObject.addNode();
    node.name = this.name;
    node.position.copy(await this.appContext.scene.getSpawnPosition());
    node.addComponent(this.componentType);
    node.start();
    this.appContext.scene.addObject(node);
  }
}

export const makeAddAmbientLightFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddSimple(appContext, 'Ambient Light', 'mp.ambientLight');
  };
};

export const makeAddDirectionalLightFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddSimple(appContext, 'Directional Light', 'mp.directionalLight');
  };
};

export const makeAddPointLightFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddSimple(appContext, 'Point Light', 'mp.pointLight');
  };
};
