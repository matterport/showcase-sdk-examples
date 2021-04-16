import { IDialogUser, MenuCommandFactory, IContext } from '../interfaces';
import { IMenuCommand } from '../interfaces';
import { ISceneNode, sphereSourceType } from '@mp/common';
import { saveStringToFile } from '../utils';
import { boxSourceType } from '@mp/common/src/sdk-components/BoxSource';

/**
 * This command loops over all components and saves the properties of each
 * sphere or box source as a javascript array.
 */
class SaveSources implements IMenuCommand<void> {
  constructor(private context: IContext) {}
  
  dialogUser(): IDialogUser|null {
    return null;
  }
  async execute(): Promise<void> {
    const sources = [];
    for (const node of this.context.scene.objects.value) {
      for (const component of node.componentIterator()) {
        if (component.componentType === boxSourceType || component.componentType === sphereSourceType) {
          const source = component.outputs.source;
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

export const makeSaveSourcesFactory = (context: IContext): MenuCommandFactory => {
  return (selection: ISceneNode[]) => {
    return new SaveSources(context);
  };
};