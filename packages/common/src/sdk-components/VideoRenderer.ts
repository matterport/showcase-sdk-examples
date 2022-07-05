import { SceneComponent, ComponentOutput } from '../SceneComponent';
import { Texture, VideoTexture } from 'three';

type Inputs = {
  src: MediaStream | string | HTMLVideoElement | null;
};

type Outputs = {
  texture: Texture | null;
} & ComponentOutput;

class VideoRenderer extends SceneComponent {
  private video: HTMLVideoElement;
  private texture: VideoTexture;

  inputs: Inputs = {
    src: null,
  }

  outputs = {
    texture: null,
  } as Outputs;

  onInit() {}

  onInputsUpdated() {
    this.releaseTexture();

    const THREE = this.context.three;
    if (!this.inputs.src) {
      this.video.src = '';
      return;
    }

    if (this.inputs.src instanceof HTMLVideoElement) {
      this.video = this.inputs.src;
    } else {
      this.video = this.createVideoElement();

      if (typeof this.inputs.src === 'string') {
        this.video.src = this.inputs.src;
      } else {
        this.video.srcObject = this.inputs.src;
      }

      this.video.load();
    }

    this.texture = new THREE.VideoTexture(this.video);
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.format = THREE.RGBAFormat;

    this.outputs.texture = this.texture;
    this.video.play();
  }

  onDestroy() {
    this.releaseTexture();
  }

  releaseTexture() {
    if (this.texture) {
      this.outputs.texture = null;
      this.texture.dispose();
    }
  }

  private createVideoElement() {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.autoplay = true;
    video.muted = true;
    video.loop = true;

    return video;
  }
}

export interface IVideoRenderer extends SceneComponent {
  inputs: Inputs;
  outputs: Outputs;
}

export const videoRendererType = 'mp.videoRenderer';
export function makeVideoRenderer() {
  return new VideoRenderer();
}
