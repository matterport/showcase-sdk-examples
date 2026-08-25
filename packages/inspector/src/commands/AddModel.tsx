import React from 'react';
import { IDialogUser, MenuCommandFactory, IAppContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { SelectUrlDialog } from '../components/SelectUrlDialog';
import { waitUntil } from '../components/Main';
import type { MpSdk } from '../../../bundle/sdk';

class AddModel implements IMenuCommand<void>, IDialogUser {
  private urlToLoad: string = null;
  private cancelled: boolean = false;

  constructor(private appContext: IAppContext) {}

  public dialogUser(): IDialogUser {
    return this;
  }

  async execute(): Promise<void> {
    await waitUntil(() => this.urlToLoad !== null || this.cancelled);

    const node = this.appContext.scene.sceneObject.addNode();
    node.name = 'New Model';
    node.position.copy(await this.appContext.scene.getSpawnPosition());
    node.addComponent('mp.gltfLoader', {
      url: this.urlToLoad,
    });
    node.start();

    this.appContext.scene.addObject(node);
  }

  onComplete(url: string): void {
    this.urlToLoad = url;
  }
  onCancelled(): void {
    this.cancelled = true;
  }

  jsx() {
    return (
      <SelectUrlDialog
        user={this}
      >
      </SelectUrlDialog>
    );
  }
}

export const makeAddModelFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new AddModel(appContext);
  }
};
