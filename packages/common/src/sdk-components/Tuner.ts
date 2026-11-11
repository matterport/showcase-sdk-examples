import type { MpSdk } from '../../../bundle/sdk';

type Inputs = {
  urls: string[];
};

type Outputs = {
  src: string;
};

enum Event {
  Next = 'next',
}

export const tunerType = 'mp.tuner';
export const makeTuner: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  let urlIndex = 0;

  return {
    inputs: {
      urls: [],
    },
    outputs: {
      src: '',
    },
    events: {
      [Event.Next]: true,
    },

    onInit() {
      this.outputs.src = this.inputs.urls.length > 0 ? this.inputs.urls[0] : '';
    },

    onEvent(eventType, _eventData) {
      if (eventType === Event.Next) {
        urlIndex++;
        if (urlIndex >= this.inputs.urls.length) {
          urlIndex = 0;
        }

        if (this.inputs.urls.length > 0) {
          this.outputs.src = this.inputs.urls[urlIndex];
        }
      }
    },
  };
};
