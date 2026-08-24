import { IDialogUser, MenuCommandFactory, IAppContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import type { MpSdk } from '../../../bundle/sdk';

class ResetScene implements IMenuCommand<void> {
  constructor(private appContext: IAppContext) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    this.appContext.scene.reset();
  }
}

export const makeResetSceneFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new ResetScene(appContext);
  };
};
