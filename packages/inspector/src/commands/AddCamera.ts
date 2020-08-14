import { IDialogUser, MenuCommandFactory, IContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { splineCameraType, DoneEvent } from '../SplineCamera';
import { SceneComponent, ISceneNode, IComponentEventSpy } from '@mp/common';

class AddCamera implements IMenuCommand<void> {
  constructor(private context: IContext) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    const node = await this.context.sdk.sdk.Scene.createNode() as ISceneNode;
    node.name = 'New SplineCamera';
    const splineCamera = node.addComponent(splineCameraType);
    const cameraControl = node.addComponent('mp.camera', {
      enabled: true,
    }) as SceneComponent;
    cameraControl.bind('camera', splineCamera, 'camera');
    
    node.start();
    this.context.scene.addObject(node);

    /**
     * Use this spy to remove the object from the scene when the animation is complete.
     */
    class DoneSpy implements IComponentEventSpy<void> {
      public eventType = DoneEvent;
      constructor(private context: IContext, private node: ISceneNode) {}
      onEvent() {
        this.context.scene.removeObject(this.node);
      }
    }

    splineCamera.spyOnEvent(new DoneSpy(this.context, node));
  }
}

export const makeAddCameraFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new AddCamera(context);
  };
};