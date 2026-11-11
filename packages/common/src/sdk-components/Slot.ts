import type { MpSdk } from '../../../bundle/sdk';
import { orientedBoxType } from './OrientedBox';

type Inputs = {
  model: string | null;
  size: { x: number; y: number; z: number };
};

export const slotType = 'mp.slot';
export const makeSlot = (sdk: MpSdk): MpSdk.Scene.IComponentFactory<Inputs, Record<string, unknown>> => () => {
  let model: MpSdk.Scene.IComponent | null = null;
  let box: MpSdk.Scene.IComponent | null = null;

  return {
    inputs: {
      model: null,
      size: { x: 1, y: 2, z: 1 },
    },

    events: {
      [sdk.Scene.InteractionType.CLICK]: false,
      [sdk.Scene.InteractionType.HOVER]: false,
      [sdk.Scene.InteractionType.DRAG]: false,
    },

    onInit() {
      // @deprecated context.root not in sdk.d.ts
      const root: MpSdk.Scene.INode = (this.context as any).root;

      let foundBox = null;
      let foundModel = null;
      for (const component of root.componentIterator()) {
        if (component.componentType === orientedBoxType) {
          foundBox = component;
        } else if (component.componentType === 'mp.gltfLoader') {
          foundModel = component;
        }
      }

      if (!foundBox || !foundModel) {
        return;
      }

      box = foundBox;
      model = foundModel;

      box.inputs.size = this.inputs.size;
    },

    onInputsUpdated(oldInputs) {
      if (oldInputs.model !== this.inputs.model) {
        console.log(`Slot.onInputsUpdated ${this.inputs.model}`);

        model.inputs.url = this.inputs.model;
      }

      if (box) {
        box.inputs.size = this.inputs.size;
      }
    },
  };
};
