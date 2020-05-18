import { orientedBoxType } from './OrientedBox';
import { SceneComponent, ComponentInteractionType } from '../SceneComponent';

interface Inputs {
  model: string | null;
  size: { x: number; y: number; z: number; };
}

class Slot extends SceneComponent {
  private model: any = null;
  private box: any = null;

  inputs: Inputs = {
    model: null,
    size: { x: 1, y: 2, z: 1 },
  };

  events: {
    [ComponentInteractionType.CLICK]: false,
    [ComponentInteractionType.HOVER]: false,
    [ComponentInteractionType.DRAG]: false
  }

  onInit() {
    const root = this.context.root;

    let box = null;
    let model = null;
    for (const component of root.componentIterator()) {
      if (component.componentType === orientedBoxType) {
        box = component;
      }
      else if (component.componentType === 'mp.gltfLoader') {
        model = component;
      }
    }

    if (!box || !model) {
      return;
    }

    this.box = box;
    this.model = model;

    this.box.inputs.size = this.inputs.size;
  }

  onInputsUpdated(oldInputs: Inputs) {
    if (oldInputs.model !== this.inputs.model) {
      console.log(`Slot.onInputsUpdated ${this.inputs.model}`)

      this.model.inputs.url = this.inputs.model;
    }

    if (this.box) {
      this.box.inputs.size = this.inputs.size;
    }
  }
}

export const slotType = 'mp.slot';
export const makeSlot = function() {
  return new Slot();
}
