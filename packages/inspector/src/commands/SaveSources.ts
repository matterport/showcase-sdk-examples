import { IDialogUser, MenuCommandFactory, IAppContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { sphereSourceType, boxSourceType } from '@mp/common';
import type { MpSdk } from '../../../bundle/sdk';
import { saveStringToFile } from '../utils';

/**
 * This command loops over all components and saves the properties of each
 * sphere or box source as a javascript array.
 */
class SaveSources implements IMenuCommand<void> {
  constructor(private appContext: IAppContext) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    const sources = [];
    for (const node of this.appContext.scene.objects.value) {
      for (const component of node.componentIterator()) {
        if (component.componentType === boxSourceType || component.componentType === sphereSourceType) {
          const source = component.outputs.source as MpSdk.Sensor.ISource;
          if (!source) continue;
          const options = {
            ...source.volume,
            userData: {
              id: node.name
            }
          };

          sources.push({
            type: source.type,
            options,
          });
        }
      }
    }

    if (sources.length === 0) {
      console.log('No sources in the scene to save.');
      return;
    }

    const serialized = JSON.stringify(sources);
    saveStringToFile(serialized, 'sources.json');
  }
}

export const makeSaveSourcesFactory = (appContext: IAppContext): MenuCommandFactory => {
  return (selection: MpSdk.Scene.INode[]) => {
    return new SaveSources(appContext);
  };
};
