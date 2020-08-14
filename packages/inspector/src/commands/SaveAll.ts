import { IDialogUser, MenuCommandFactory, IContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { ISceneNode } from '@mp/common';
import { saveStringToFile } from '../utils';

class SaveAll implements IMenuCommand<void> {
  constructor(private context: IContext) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    if (this.context.scene.objects.value.length === 0) {
      console.log('No items in the scene to save.');
      return;
    }
    const serialized = await this.context.scene.serialize();
    saveStringToFile(serialized, 'scene.json');
  }
}

export const makeSaveAllFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new SaveAll(context);
  };
};