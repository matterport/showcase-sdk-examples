import { MenuCommandFactory, IContext } from '../interfaces';
import { makeAddChairFactory } from '../commands/AddChair';
import { makeAddCameraFactory } from '../commands/AddCamera';
import { makeCloseupViewFactory } from '../commands/CloseupView';
import { makeResetSceneFactory } from '../commands/ResetScene';
import { makeSaveSelectionFactory } from '../commands/SaveSelection';
import { makeSaveAllFactory } from '../commands/SaveAll';
import {
  makeAddAmbientLightFactory,
  makeAddDirectionalLightFactory,
  makeAddPointLightFactory,
} from '../commands/AddLights';
import { makeBoxSourceFactory, makeCylinderSourceFactory, makeSphereSourceFactory } from '../commands/AddSource';
import { makeSaveSourcesFactory } from '../commands/SaveSources';

export type MenuItemDescriptor = {
  title: string;
  factoryMaker: (context: IContext) => MenuCommandFactory;

  // filled in by Main.tsx
  commandFactory?: MenuCommandFactory;
  command?: () => Promise<void>;
};

export type MenuDescriptor = {
  label: string;
  items: MenuItemDescriptor[];
};

export const Menus: MenuDescriptor[] = [
  {
    label: 'Scene',
    items: [
      {
        title: 'Reset scene',
        factoryMaker: makeResetSceneFactory,
      },
      {
        title: 'Save all',
        factoryMaker: makeSaveAllFactory,
      },
      {
        title: 'Save selection',
        factoryMaker: makeSaveSelectionFactory,
      },
    ],
  },
  {
    label: 'Add',
    items: [
      {
        title: 'Chair',
        factoryMaker: makeAddChairFactory,
      },
      {
        title: 'Ambient Light',
        factoryMaker: makeAddAmbientLightFactory,
      },
      {
        title: 'Directional Light',
        factoryMaker: makeAddDirectionalLightFactory,
      },
      {
        title: 'Point Light',
        factoryMaker: makeAddPointLightFactory,
      },
      {
        title: 'Sphere Source',
        factoryMaker: makeSphereSourceFactory,
      },
      {
        title: 'Box Source',
        factoryMaker: makeBoxSourceFactory,
      },
      {
        title: 'Cylinder Source',
        factoryMaker: makeCylinderSourceFactory,
      }
    ],
  },
  {
    label: 'Actions',
    items: [
      {
        title: 'Animated fly-through',
        factoryMaker: makeAddCameraFactory,
      },
      {
        title: 'Closeup of selection',
        factoryMaker: makeCloseupViewFactory,
      },
      {
        title: 'Save Sources as array',
        factoryMaker: makeSaveSourcesFactory,
      }
    ]
  },
];
