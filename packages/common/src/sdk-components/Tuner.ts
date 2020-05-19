import { SceneComponent, ComponentOutput } from '../SceneComponent';

type Inputs = {
  urls: string[];
};

type Outputs = {
  src: string;
} & ComponentOutput;

enum Event {
  Next = 'next',
};

type Events = {
  [Event.Next]: boolean,
};

class Tuner extends SceneComponent {
  private urlIndex = 0;

  inputs = {
    urls: [],
  } as Inputs;

  outputs = {
    src: '',
  } as Outputs;

  events: Events = {
    [Event.Next]: true,
  };

  onInit() {
    this.outputs.src = this.inputs.urls.length > 0 ? this.inputs.urls[0] : '';
  }

  onEvent(eventType: string, eventData: unknown) {
    if (eventType === Event.Next) {
      this.urlIndex++;
      if (this.urlIndex >= this.inputs.urls.length) {
        this.urlIndex = 0;
      }

      if (this.inputs.urls.length > 0) {
        this.outputs.src = this.inputs.urls[this.urlIndex];
      }
    }
  }
}

export const tunerType = 'mp.tuner';
export function makeTuner() {
  return new Tuner();
}
