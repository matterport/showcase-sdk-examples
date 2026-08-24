import React from 'react';
import { MenuCommandFactory, IDialogUser, IAppContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { KeyEvent, Keys } from '@mp/common';
import type { MpSdk } from '../../../bundle/sdk';
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
  private node: MpSdk.Scene.INode = null;
  private user: DialogUser = new DialogUser(this);

  constructor(private appContext: IAppContext, private target: MpSdk.Scene.INode) {}

  dialogUser(): IDialogUser|null {
    return null;
  }

  public removeNode() {
    if (this.node) {
      this.appContext.scene.removeObject(this.node);
      this.node.stop();
      this.node = null;
    }
  }

  async execute(): Promise<void> {
    if (!this.target) {
      console.log('No target selected, exiting.');
      return;
    }

    const obj = this.appContext.scene.sceneObject;
    this.node = obj.addNode();
    this.node.name = 'New Closeup View';

    const closeupView = this.node.addComponent(closeupViewType, {
      target: this.target,
    });
    const cameraControl = this.node.addComponent('mp.camera', {
      enabled: true,
    });


    const sdk = this.appContext.sdk.sdk;
    class KeySpy implements MpSdk.Scene.IComponentEventSpy<KeyEvent> {
      public eventType = sdk.Scene.InteractionType.KEY;
      constructor(private cmd: CloseupView) {}
      onEvent(event: KeyEvent) {
        if (event.key === Keys.ESCAPE) {
          this.cmd.removeNode();
        }
      }
    }

    const input = this.node.addComponent('mp.input');
    input.spyOnEvent(new KeySpy(this));

    obj.bindPath(obj.addInputPath(cameraControl, 'camera'), obj.addOutputPath(closeupView, 'camera'));
    obj.bindPath(obj.addEventPath(closeupView, 'ONACCESSGRANTED'), obj.addEmitPath(cameraControl, 'ONACCESSGRANTED'));
    this.node.start();
    this.appContext.scene.addObject(this.node);
    this.appContext.frameOverlay.next(this.user);

    await waitUntil(() => this.node === null);
    this.appContext.frameOverlay.next(null);
  }
}

export const makeCloseupViewFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new CloseupView(appContext, selection[0]);
  };
};
