import { IDialogUser, MenuCommandFactory, IContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { ISceneNode } from '@mp/common';

class ResetScene implements IMenuCommand<void> {
  constructor(private context: IContext) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    this.context.scene.reset();
  }
}

export const makeResetSceneFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new ResetScene(context);
  };
};