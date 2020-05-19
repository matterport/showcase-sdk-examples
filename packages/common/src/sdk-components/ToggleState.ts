import { SceneComponent, ComponentOutput } from '../SceneComponent';

enum Event {
  Toggle = 'toggle',
}

type Inputs = {
  initialState: boolean;
};

type Outputs = {
  state: boolean;
  negated: boolean;
} & ComponentOutput;

type Events = {
  [Event.Toggle]: boolean;
};


class ToggleState extends SceneComponent {
  inputs: Inputs = {
    initialState: false,
  }

  outputs = {
    state: false,
    negated: true,
  } as Outputs;

  events = {
    toggle: true,
  } as Events;

  onInit() {
    this.outputs.state = this.inputs.initialState;
    this.outputs.negated = !this.outputs.state;
  }

  onEvent(eventType: string, eventData: unknown) {
    if (eventType === Event.Toggle) {
      this.outputs.state = !this.outputs.state;
      this.outputs.negated = !this.outputs.state;
    }
  }
}

export const toggleStateType = 'mp.toggleState';
export function makeToggleState() {
  return new ToggleState();
}
