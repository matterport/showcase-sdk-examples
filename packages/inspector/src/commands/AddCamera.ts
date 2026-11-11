import { IDialogUser, MenuCommandFactory, IAppContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { splineCameraType, DoneEvent } from '../SplineCamera';
import type { MpSdk } from '../../../bundle/sdk';

class AddCamera implements IMenuCommand<void> {
  constructor(private appContext: IAppContext) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    const obj = this.appContext.scene.sceneObject;
    const node = obj.addNode();
    node.name = 'New SplineCamera';
    node.position.copy(await this.appContext.scene.getSpawnPosition());
    const splineCamera = node.addComponent(splineCameraType);
    const cameraControl = node.addComponent('mp.camera', {
      enabled: true,
    });

    obj.bindPath(obj.addInputPath(cameraControl, 'camera'), obj.addOutputPath(splineCamera, 'camera'));

    node.start();
    this.appContext.scene.addObject(node);

    // Remove the object from the scene when the animation is complete.
    const doneSpy = {
      id: 'splineCamera-done',
      path: obj.addEventPath(splineCamera, DoneEvent),
      onEvent: () => {
        this.appContext.scene.removeObject(node);
      },
    };
    obj.spyOnEvent(doneSpy);
  }
}

export const makeAddCameraFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddCamera(appContext);
  };
};
