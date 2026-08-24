import { IDialogUser, MenuCommandFactory, IAppContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import type { MpSdk } from '../../../bundle/sdk';
import { saveStringToFile } from '../utils';

class SaveAll implements IMenuCommand<void> {
  constructor(private appContext: IAppContext) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    if (this.appContext.scene.objects.value.length === 0) {
      console.log('No items in the scene to save.');
      return;
    }
    const serialized = await this.appContext.scene.serialize();
    saveStringToFile(serialized, 'scene.json');
  }
}

export const makeSaveAllFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new SaveAll(appContext);
  };
};
