import { IDialogUser, MenuCommandFactory, IContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { ISceneNode } from '@mp/common';
import { saveStringToFile } from '../utils';

class SaveSelection implements IMenuCommand<void> {
  constructor(private context: IContext, private selection: ISceneNode[]) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    if (!this.selection || this.selection.length === 0) {
      console.log('No items selected to save.');
      return;
    }

    const serialized = await this.context.sdk.sdk.Scene.serialize(this.selection);
    saveStringToFile(serialized, 'selection.json');
  }
}

export const makeSaveSelectionFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new SaveSelection(context, selection);
  };
};