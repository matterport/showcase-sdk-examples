import { SceneComponent, ComponentOutput } from '../SceneComponent';

type Inputs = {
  /**
   * A device id returned by a call to `navigator.mediaDevices.enumerateDevices()` or null to use the default video input source
   */
  deviceId: string | null;

  enabled: boolean;
}

type Outputs = {
  /**
   * A `MediaStream` object ready for use in the `VideoRenderer`
   */
  stream: MediaStream;
  /**
   * The aspect ratio of the first video track of the `stream`. Useful in maintaining the proportion when rendered to a `TextureRenderer`
   */
  aspect: number;
} & ComponentOutput;

class VideoStreamCapture extends SceneComponent {
  inputs: Inputs = {
    deviceId: null,
    enabled: false,
  };

  outputs = {
    stream: null,
    aspect: 1,
  } as Outputs;

  onInit() {
    if (this.inputs.enabled) {
      this.setupStream();
    }
  }

  onInputsUpdated(oldInputs: Inputs) {
    if (!this.inputs.enabled) {
      this.destroyOutputStream();
      return;
    }

    if (oldInputs.deviceId !== this.inputs.deviceId) {
      this.destroyOutputStream();
    }

    this.setupStream();
  }

  private setupStream() {
    // if a specific device is specified, open that stream
    if (this.inputs.deviceId) {
      this.updateVideoDevice({
        video: {
          deviceId: {
            exact: this.inputs.deviceId,
          },
        },
      });
    } else {
      // otherwise, fallback to the default video device
      this.updateVideoDevice({ video: true });
    }
  }

  onDestroy() {
    this.destroyOutputStream();
  }

  private async updateVideoDevice(constraints: MediaStreamConstraints) {
    const source = await navigator.mediaDevices.getUserMedia(constraints);
    const videoTrack = source.getVideoTracks()[0];
    if (videoTrack) {
      this.outputs.stream = source;
      const videoSettings = videoTrack.getSettings();
      this.outputs.aspect = videoSettings.aspectRatio;
    }
  }

  private destroyOutputStream() {
    const stream = this.outputs.stream;
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }

      this.outputs.stream = null;
    }
  }
}

export interface IVideoStreamCapture extends SceneComponent {
  inputs: Inputs;
  outputs: Outputs;
}

export const videoStreamCaptureType = 'mp.videoStreamCapture';
export function makeVideoStreamCapture() {
  return new VideoStreamCapture();
}
