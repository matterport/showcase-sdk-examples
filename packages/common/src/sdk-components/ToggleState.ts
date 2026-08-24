import type { MpSdk } from '../../../bundle/sdk';

enum Event {
  Toggle = 'toggle',
}

type Inputs = {
  initialState: boolean;
};

type Outputs = {
  state: boolean;
  negated: boolean;
};

export const toggleStateType = 'mp.toggleState';
export const makeToggleState: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  return {
    inputs: {
      initialState: false,
    },
    outputs: {
      state: false,
      negated: true,
    },
    events: {
      toggle: true,
    },

    onInit() {
      this.outputs.state = this.inputs.initialState;
      this.outputs.negated = !this.outputs.state;
    },

    onEvent(eventType, _eventData) {
      if (eventType === Event.Toggle) {
        this.outputs.state = !this.outputs.state;
        this.outputs.negated = !this.outputs.state;
      }
    },
  };
};
