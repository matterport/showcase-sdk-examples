import type { MpSdk } from '../../../bundle/sdk';
import type { Texture, VideoTexture } from 'three';

type Inputs = {
  src: MediaStream | string | HTMLVideoElement | null;
};

type Outputs = {
  texture: Texture | null;
};

export interface IVideoRenderer {
  inputs: Inputs;
  outputs: Outputs;
}

export const videoRendererType = 'mp.videoRenderer';
export const makeVideoRenderer: MpSdk.Scene.IComponentFactory<Inputs, Outputs> = () => {
  let video: HTMLVideoElement;
  let texture: VideoTexture;

  const createVideoElement = () => {
    const v = document.createElement('video');
    v.crossOrigin = 'anonymous';
    v.autoplay = true;
    v.muted = true;
    v.loop = true;

    return v;
  };

  const releaseTexture = (self: MpSdk.Scene.IComponentThis<Inputs, Outputs>) => {
    if (texture) {
      self.outputs.texture = null;
      texture.dispose();
    }
  };

  return {
    inputs: {
      src: null,
    },

    outputs: {
      texture: null,
    },

    onInit() {},

    onInputsUpdated() {
      releaseTexture(this);

      const THREE = this.context.three;
      if (!this.inputs.src) {
        video.src = '';
        return;
      }

      if (this.inputs.src instanceof HTMLVideoElement) {
        video = this.inputs.src;
      } else {
        video = createVideoElement();

        if (typeof this.inputs.src === 'string') {
          video.src = this.inputs.src;
        } else {
          video.srcObject = this.inputs.src;
        }

        video.load();
      }

      texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;

      this.outputs.texture = texture;
      video.play();
    },

    onDestroy() {
      releaseTexture(this);
    },
  };
};
