import React from 'react';
import { MenuCommandFactory, IDialogUser, IContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { ISceneNode, SceneComponent, IComponentEventSpy, ComponentInteractionType, KeyEvent, Keys } from '@mp/common';
import { closeupViewType } from '../CloseupView';
import { CancelCloseup } from '../components/CancelCloseup';
import { waitUntil } from '../components/Main';

class DialogUser implements IDialogUser {
  constructor(private view: CloseupView) {
    this.onComplete = this.onComplete.bind(this);
  }

  jsx(): JSX.Element {
    return (
      <CancelCloseup onClose={this.onComplete}></CancelCloseup>
    );
  }

  onComplete(): void {
    this.view.removeNode();
  }

  onCancelled(): void {  
  }
};

class CloseupView implements IMenuCommand<void> {
  private node: ISceneNode = null;
  private user: DialogUser = new DialogUser(this);

  constructor(private context: IContext, private target: ISceneNode) {}

  dialogUser(): IDialogUser|null {
    return null;
  }

  public removeNode() {
    if (this.node) {
      this.context.scene.removeObject(this.node);
      this.node.stop();
      this.node = null;
    }
  }

  async execute(): Promise<void> {
    if (!this.target) {
      console.log('No target selected, exiting.');
      return;
    }

    this.node = await this.context.sdk.sdk.Scene.createNode() as ISceneNode;
    this.node.name = 'New Closeup View';

    const closeupView = this.node.addComponent(closeupViewType, {
      target: this.target,
    });
    const cameraControl = this.node.addComponent('mp.camera', {
      enabled: true,
    }) as SceneComponent;


    class KeySpy implements IComponentEventSpy<KeyEvent> {
      public eventType = ComponentInteractionType.KEY;
      constructor(private cmd: CloseupView) {}
      onEvent(event: KeyEvent) {
        if (event.key === Keys.ESCAPE) {
          this.cmd.removeNode();
        }
      }
    }

    const input = this.node.addComponent('mp.input') as SceneComponent;
    input.spyOnEvent(new KeySpy(this));

    cameraControl.bind('camera', closeupView, 'camera');
    closeupView.bindEvent('ONACCESSGRANTED', cameraControl, 'ONACCESSGRANTED');
    this.node.start();
    this.context.scene.addObject(this.node);
    this.context.frameOverlay.next(this.user);

    await waitUntil(() => this.node === null);
    this.context.frameOverlay.next(null);
  }
}

export const makeCloseupViewFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new CloseupView(context, selection[0]);
  };
};