import type { MpSdk } from '../../../bundle/sdk';
import type { VideoTexture } from 'three';
import Hls from 'hls.js';

type Inputs = {
  src: string;
  enabled: boolean;
};

type Outputs = {
  video: HTMLVideoElement | null;
  aspect: number;
};

export const hlsLoaderType = 'mp.hlsLoader';
export const makeHlsLoader: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  let video: HTMLVideoElement | null = null;
  let texture: VideoTexture | null = null;
  let hls: Hls | null = null;

  const createVideoElement = () => {
    const v = document.createElement('video');
    v.crossOrigin = 'anonymous';
    v.setAttribute('height', '480');
    v.setAttribute('width', '720');
    v.volume = 0.1;
    return v;
  };

  const releaseResources = (outputs: Partial<Outputs>) => {
    if (hls) {
      hls.destroy();
      hls = null;
    }

    if (texture) {
      texture.dispose();
      texture = null;
      outputs.video = null;
    }
  };

  const setupStream = (inputs: Inputs, outputs: Partial<Outputs>) => {
    releaseResources(outputs);

    if (inputs.enabled) {
      video = createVideoElement();
      hls = new Hls();
      hls.loadSource(inputs.src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        outputs.video = video;
      });
    }
  };

  return {
    inputs: {
      src: '',
      enabled: false,
    },
    outputs: {
      video: null,
      aspect: 1,
    },

    onInit() {
      this.outputs.aspect = 720 / 480;
      if (this.inputs.enabled) {
        setupStream(this.inputs, this.outputs);
      }
    },

    onInputsUpdated() {
      setupStream(this.inputs, this.outputs);
    },

    onDestroy() {
      releaseResources(this.outputs);
    },
  };
};
