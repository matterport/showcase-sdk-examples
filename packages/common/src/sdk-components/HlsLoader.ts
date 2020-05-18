import { SceneComponent, ComponentOutput } from '@mp/common';
import { VideoTexture } from 'three';
import Hls from 'hls.js';

type Inputs = {
  src: string;
  enabled: boolean;
};

type Outputs = {
  video: HTMLVideoElement | null;
  aspect: number;
} & ComponentOutput;

class HlsLoader extends SceneComponent {
  private video: HTMLVideoElement | null = null;
  private texture: VideoTexture | null = null;
  private hls: Hls | null = null;

  inputs: Inputs = {
    src: '',
    enabled: false,
  }

  outputs = {
    video: null,
    aspect: 1,
  } as Outputs;

  onInit() {
    this.outputs.aspect = 720/480;
    if (this.inputs.enabled) {
      this.setupStream();
    }
  }

  onInputsUpdated() {

    this.setupStream();
  }

  onDestroy() {
    this.releaseResources();
  }

  private createVideoElement() {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.setAttribute('height', '480');
    video.setAttribute('width', '720');
    video.volume = 0.1;
    return video;
  }

  private setupStream() {
    this.releaseResources();

    if (this.inputs.enabled) {
      this.video = this.createVideoElement();
      this.hls = new Hls();
      this.hls.loadSource(this.inputs.src);
      this.hls.attachMedia(this.video);
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.outputs.video = this.video;
      });
    }
  }

  private releaseResources() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
      this.outputs.video = null;
    }
  }
}

export const hlsLoaderType = 'mp.hlsLoader';
export function makeHlsLoader() {
  return new HlsLoader();
}
