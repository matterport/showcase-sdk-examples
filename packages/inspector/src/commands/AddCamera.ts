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

    /**
     * Use this spy to remove the object from the scene when the animation is complete.
     */
    class DoneSpy implements MpSdk.Scene.IComponentEventSpy<void> {
      public eventType = DoneEvent;
      constructor(private appContext: IAppContext, private node: MpSdk.Scene.INode) {}
      onEvent() {
        this.appContext.scene.removeObject(this.node);
      }
    }

    splineCamera.spyOnEvent(new DoneSpy(this.appContext, node));
  }
}

export const makeAddCameraFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddCamera(appContext);
  };
};
