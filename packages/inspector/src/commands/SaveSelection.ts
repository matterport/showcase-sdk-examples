import { IDialogUser, MenuCommandFactory, IAppContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import type { MpSdk } from '../../../bundle/sdk';
import { saveStringToFile } from '../utils';

class SaveSelection implements IMenuCommand<void> {
  constructor(private appContext: IAppContext, private selection: MpSdk.Scene.INode[]) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    if (!this.selection || this.selection.length === 0) {
      console.log('No items selected to save.');
      return;
    }

    const serialized = await this.appContext.sdk.sdk.Scene.serialize(this.selection);
    saveStringToFile(serialized, 'selection.json');
  }
}

export const makeSaveSelectionFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new SaveSelection(appContext, selection);
  };
};
