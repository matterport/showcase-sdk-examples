import type { MpSdk } from '../../../bundle/sdk';

type Inputs = {
  /**
   * A device id returned by a call to `navigator.mediaDevices.enumerateDevices()` or null to use the default video input source
   */
  deviceId: string | null;

  enabled: boolean;
};

type Outputs = {
  /**
   * A `MediaStream` object ready for use in the `VideoRenderer`
   */
  stream: MediaStream;
  /**
   * The aspect ratio of the first video track of the `stream`. Useful in maintaining the proportion when rendered to a `TextureRenderer`
   */
  aspect: number;
};

export interface IVideoStreamCapture {
  inputs: Inputs;
  outputs: Outputs;
}

export const videoStreamCaptureType = 'mp.videoStreamCapture';
export const makeVideoStreamCapture: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  const updateVideoDevice = async (
    self: MpSdk.Scene.IComponentThis<Inputs, Outputs>,
    constraints: MediaStreamConstraints
  ) => {
    const source = await navigator.mediaDevices.getUserMedia(constraints);
    const videoTrack = source.getVideoTracks()[0];
    if (videoTrack) {
      self.outputs.stream = source;
      const videoSettings = videoTrack.getSettings();
      self.outputs.aspect = videoSettings.aspectRatio;
    }
  };

  const setupStream = (self: MpSdk.Scene.IComponentThis<Inputs, Outputs>) => {
    // if a specific device is specified, open that stream
    if (self.inputs.deviceId) {
      updateVideoDevice(self, {
        video: {
          deviceId: {
            exact: self.inputs.deviceId,
          },
        },
      });
    } else {
      // otherwise, fallback to the default video device
      updateVideoDevice(self, { video: true });
    }
  };

  const destroyOutputStream = (self: MpSdk.Scene.IComponentThis<Inputs, Outputs>) => {
    const stream = self.outputs.stream;
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }

      self.outputs.stream = null;
    }
  };

  return {
    inputs: {
      deviceId: null,
      enabled: false,
    },

    outputs: {
      stream: null,
      aspect: 1,
    } as Partial<Outputs>,

    onInit() {
      if (this.inputs.enabled) {
        setupStream(this);
      }
    },

    onInputsUpdated(oldInputs) {
      if (!this.inputs.enabled) {
        destroyOutputStream(this);
        return;
      }

      if (oldInputs.deviceId !== this.inputs.deviceId) {
        destroyOutputStream(this);
      }

      setupStream(this);
    },

    onDestroy() {
      destroyOutputStream(this);
    },
  };
};
