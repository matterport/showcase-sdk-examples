import React from 'react';
import { IDialogUser, MenuCommandFactory, IContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { SelectUrlDialog } from '../components/SelectUrlDialog';
import { waitUntil } from '../components/Main';
import { ISceneNode } from '@mp/common';

class AddModel implements IMenuCommand<void>, IDialogUser {
  private urlToLoad: string = null;
  private cancelled: boolean = false;

  constructor(private context: IContext) {}

  public dialogUser(): IDialogUser {
    return this;
  }

  async execute(): Promise<void> {
    await waitUntil(() => this.urlToLoad !== null || this.cancelled);
    
    const node = await this.context.sdk.sdk.Scene.createNode();
    node.name = 'New Model';
    node.addComponent('mp.gltfLoader', {
      url: this.urlToLoad,
    });
    node.start();

    this.context.scene.addObject(node);
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

export const makeAddModelFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new AddModel(context);
  }
};
